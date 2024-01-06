"use server";

import { db } from "@/utils/db.server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { UserNameAndNotedId } from "@/utils/types";
import { revalidatePath } from "next/cache";
import { writeImage } from "@/utils/misc";
import { getId } from "@/utils/db.server";

export async function getUserName(userName: string) {
  try {
    const user = db.user.findFirst({
      where: {
        username: {
          equals: userName,
        },
      },
    });
    console.log(user);
    return { user };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getOwnerAndNotes(userName: string) {
  try {
    const owner = db.user.findFirst({
      where: {
        username: {
          equals: userName,
        },
      },
    });

    // Reassign notes to empty array if null
    const notes =
      db.note
        .findMany({
          where: {
            owner: {
              username: {
                equals: userName,
              },
            },
          },
        })
        .map(({ id, title }) => ({ id, title })) ?? [];

    return { owner, notes };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getNote(noteId: string) {
  try {
    const note = db.note.findFirst({
      where: {
        id: {
          equals: noteId,
        },
      },
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

const deleteNoteInDB = (noteId: string) => {
  try {
    const result = db.note.delete({
      where: {
        id: {
          equals: noteId,
        },
      },
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

// export const updateNote: UpdateNote = async (
//   prevState: UserNameAndNotedId,
//   formData: FormData
// ) => {
//   const { noteId, userName } = prevState;
//   const title = formData.get("title") as string;
//   const content = formData.get("content") as string;

//   if (!title) {
//     throw new Response("Title must be provided", { status: 400 });
//   }

//   if (!content) {
//     throw new Response("Content must be provided", { status: 400 });
//   }

//   const result = updateNoteInDB(noteId, title, content);
//   if (result) {
//     return redirect(`/users/${userName}/notes/${noteId}`);
//   } else {
//     return "Failed";
//   }
// };

export async function updateNote(
  prevState: UserNameAndNotedId,
  formData: FormData
) {
  const { noteId, userName } = prevState;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const file = formData.get("file") as File;
  const altText = formData.get("altText") as string;

  console.log("file, altText: ", file, altText);
  const images = [
    {
      id: "",
      file,
      altText,
    },
  ];

  const noteImagePromises =
    images?.map(async (image) => {
      if (!image) return null;

      if (image.id) {
        const hasReplacement = (image?.file?.size || 0) > 0;
        const filepath =
          image.file && hasReplacement
            ? await writeImage(image.file)
            : undefined;
        // update the ID so caching is invalidated
        const id = image.file && hasReplacement ? getId() : image.id;

        return db.image.update({
          where: { id: { equals: image.id } },
          data: {
            id,
            filepath,
            altText: image.altText,
          },
        });
      } else if (image.file) {
        if (image.file.size < 1) return null;
        const filepath = await writeImage(image.file);
        return db.image.create({
          altText: image.altText,
          filepath,
          contentType: image.file.type,
        });
      } else {
        return null;
      }
    }) ?? [];

  const noteImages = await Promise.all(noteImagePromises);
  db.note.update({
    where: { id: { equals: noteId } },
    data: {
      title,
      content,
      //@ts-expect-error //TODO fix this type issue later
      images: noteImages.filter(Boolean),
    },
  });

  revalidatePath(`/users/${userName}/notes/${noteId}`);
  return redirect(`/users/${userName}/notes/${noteId}`);
}
