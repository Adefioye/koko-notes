"use server";

import { db } from "@/utils/db.server";
import { prisma } from "./../utils/db.server";
import { redirect } from "next/navigation";
import { NoteEditorSchema, UserNameAndNotedId } from "@/utils/types";
import { revalidatePath } from "next/cache";
import { hasImageFile, hasImageId, writeImage } from "@/utils/misc";
import { getId } from "@/utils/db.server";
import { zip } from "lodash";

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

const updateNoteInDB = (noteId: string, title: string, content: string) => {
  try {
    const result = db.note.update({
      where: { id: { equals: noteId } },
      data: { title, content },
    });

    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export type UpdateNote = (
  prevState: UserNameAndNotedId,
  formData: FormData
) => string | Promise<string | { error: string }>;

const deleteNoteInDB = async (noteId: string) => {
  try {
    const result = await prisma.note.delete({
      where: { id: noteId },
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function deleteNote(
  prevState: UserNameAndNotedId,
  formData: FormData
) {
  const { userName, noteId } = prevState;
  const intent = formData.get("intent");
  console.log("Intent: ", intent);
  switch (intent) {
    case "delete":
      deleteNoteInDB(noteId);
      break;
    default:
      throw new Response("Bad Request", { status: 400 });
  }

  revalidatePath(`/users/${userName}/notes`);
  redirect(`/users/${userName}/notes`);
}

export async function updateNote(
  prevState: UserNameAndNotedId,
  formData: FormData
) {
  console.log("Form data: ", formData);
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
    altText: image[2],
  }));

  const parsedFormData = {
    title,
    content,
    images,
  };

  // Validate parsed form data as NoteEditorSchema type
  const result = NoteEditorSchema.safeParse(parsedFormData);

  if (!result.success) {
    throw new Response("Error parsing form data", { status: 400 });
  }

  const {
    title: newTitle,
    content: newContent,
    images: newImages,
  } = result.data;

  // 2. Update changed images by deleting and updating
  // This would have image id and would have file
  // To achieve this, get images with known ids and remove them from database
  // Then add images with known ids to the database
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

  // 1. Update title and content based on noteId
  await prisma.note.update({
    where: { id: noteId },
    data: {
      title: newTitle,
      content: newContent,
    },
  });

  // 2. For images in db that we have deleted on the client, we delete from db

  await prisma.noteImage.deleteMany({
    where: {
      id: {
        notIn: newNoteImagesToUpdate.map((image) => image?.id),
      },
    },
  });

  // 3. Update images with newImagesToUpdate
  for (const image of newNoteImagesToUpdate) {
    await prisma.noteImage.update({
      where: { id: image.id },
      data: {
        altText: image.altText,
        blob: image.blob,
        contentType: image.contentType,
      },
    });
  }

  // 3. Add new Images if exist
  for (const image of newNoteImagesToCreate) {
    if (image) {
      await prisma.noteImage.create({
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
