"use server";

import { prisma } from "./../utils/db.server";
import { redirect } from "next/navigation";
import {
  NoteEditorSchema,
  UserNameAndNotedId,
  UserSearchResultsSchema,
} from "@/utils/types";
import { revalidatePath } from "next/cache";
import { hasImageFile, hasImageId } from "@/utils/misc";
import { z } from "zod";

import { zip } from "lodash";
import { action } from "./safeAction";
import { PrismaClient } from "@prisma/client";

export async function getUserName(userName: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: userName },
      select: {
        name: true,
        createdAt: true,
        image: { select: { id: true } },
        username: true,
      },
    });

    return { user };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getOwnerAndNotes(userName: string) {
  try {
    const owner = await prisma.user.findUnique({
      select: {
        name: true,
        username: true,
        image: { select: { id: true } },
        notes: { select: { id: true, title: true } },
      },
      where: { username: userName },
    });

    return { owner };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getNote(noteId: string) {
  try {
    const note = await prisma.note.findUnique({
      select: {
        title: true,
        content: true,
        images: { select: { id: true, altText: true } },
      },
      where: { id: noteId },
    });
    return { note };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const InputDeleteNote = z.object({
  userName: z.string(),
  noteId: z.string(),
  intent: z.string(),
});

export async function deleteNoteHandler({
  userName,
  noteId,
  intent,
}: z.infer<typeof InputDeleteNote>) {
  switch (intent) {
    case "delete":
      try {
        await prisma.note.delete({
          where: { id: noteId },
        });

        revalidatePath(`/users/${userName}/notes`);
        return {
          success: `Deleted note ${noteId} belonging to ${userName} succesfully`,
        };
      } catch (error) {
        return { error: `Failed to delete ${noteId} belonging to ${userName}` };
      }

    default:
      return { error: "Bad request, Try again!" };
  }
}

export const deleteNote = action(InputDeleteNote, deleteNoteHandler);

export async function updateNote(
  prevState: UserNameAndNotedId,
  formData: FormData
) {
  const { noteId, userName } = prevState;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const imageFiles = formData.getAll("file") as File[];
  const imageAltTexts = formData.getAll("altText") as string[];
  const imageIds = formData.getAll("imageId") as string[];

  const zipImageFeatures = zip(imageIds, imageFiles, imageAltTexts);
  const images = zipImageFeatures.map((image) => ({
    id: image[0],
    file: image[1]!,
    altText: image[2]!,
  }));

  const transFormedFormData = {
    title,
    content,
    images,
  };

  // Validate parsed form data as NoteEditorSchema type
  const result = NoteEditorSchema.safeParse(transFormedFormData);

  if (!result.success) {
    console.log("Field errors: ", result.error.flatten().fieldErrors);
    throw new Response("Error parsing form data", { status: 400 });
  }

  const {
    title: newTitle,
    content: newContent,
    images: newImages,
  } = result.data;

  const newNoteImagesToUpdate = newImages
    ? await Promise.all(
        newImages.filter(hasImageId).map(async (image) => {
          if (hasImageFile(image)) {
            return {
              id: image.id,
              altText: image.altText,
              contentType: image.file.type,
              blob: Buffer.from(await image.file.arrayBuffer()),
            };
          }
          return {
            id: image.id,
            altText: image.altText,
          };
        })
      )
    : [];

  const newNoteImagesToCreate = newImages
    ? await Promise.all(
        newImages?.filter(hasImageFile).map(async (image) => {
          if (!hasImageId(image)) {
            return {
              altText: image.altText,
              contentType: image.file.type,
              blob: Buffer.from(await image.file.arrayBuffer()),
            };
          }
        })
      )
    : [];

  await prisma.$transaction(async ($prisma) => {
    // 1. Update title and content based on noteId
    await $prisma.note.update({
      where: { id: noteId },
      data: {
        title: newTitle,
        content: newContent,
      },
    });
    // 2. For images in db that we have removed on the client, we delete from db
    const imagesBefore = await $prisma.noteImage.count({ where: { noteId } });
    await $prisma.noteImage.deleteMany({
      where: {
        noteId,
        id: {
          notIn: newNoteImagesToUpdate.map((image) => image?.id),
        },
      },
    });
    const imagesAfter = await $prisma.noteImage.count({ where: { noteId } });
    console.log(`Deleted ${imagesBefore - imagesAfter} images`);

    // 3. Update images with newImagesToUpdate
    for (const image of newNoteImagesToUpdate) {
      if (image) {
        await $prisma.noteImage.update({
          where: { id: image.id },
          data: {
            altText: image.altText,
            blob: image.blob,
            contentType: image.contentType,
          },
        });
      }
    }

    // 4. Add new Images if exist
    for (const image of newNoteImagesToCreate) {
      if (image) {
        await $prisma.noteImage.create({
          data: {
            altText: image.altText,
            blob: image.blob,
            contentType: image.contentType,
            noteId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    }
  });

  revalidatePath(`/users/${userName}/notes/${noteId}`);
  return redirect(`/users/${userName}/notes/${noteId}`);
}

export async function signUp(prevState: any, formData: FormData) {
  const nameConfirm = formData.get("name__confirm");

  console.log("Name confirm: ", nameConfirm);

  if (nameConfirm) {
    throw new Response("Cannot submit sign up form", { status: 400 });
  }
}

export async function searchUser(term: string) {
  const like = `%${term ?? ""}%`;

  const users = await prisma.$queryRawUnsafe(`
  SELECT U.id, U.username, U.name, UI.id AS "imageId"
  FROM "User" AS U
  LEFT JOIN "UserImage" AS UI ON U.id = UI."userId"
  LEFT JOIN (
    SELECT "ownerId", MAX("updatedAt") AS "maxUpdatedAt"
    FROM "Note"
    GROUP BY "ownerId"
  ) AS N ON U.id = N."ownerId"
  WHERE U.username ILIKE $1 OR U.name ILIKE $2
  ORDER BY N."maxUpdatedAt" DESC
  LIMIT 50
`, like, like)

  const results = UserSearchResultsSchema.safeParse(users);

  if (!results.success) {
    throw new Response("Error parsing users result", { status: 400 });
  }

  return { users: results.data };
}
