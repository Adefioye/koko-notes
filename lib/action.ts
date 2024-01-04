"use server";

import { db } from "@/utils/db.server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { UserNameAndNotedId } from "@/utils/types";
import { revalidatePath } from "next/cache";

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

export const updateNote: UpdateNote = async (
  prevState: UserNameAndNotedId,
  formData: FormData
) => {
  const { noteId, userName } = prevState;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title) {
    throw new Response("Title must be provided", { status: 400 });
  }

  if (!content) {
    throw new Response("Content must be provided", { status: 400 });
  }

  const result = updateNoteInDB(noteId, title, content);
  if (result) {
    return redirect(`/users/${userName}/notes/${noteId}`);
  } else {
    return "Failed";
  }
};

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
