"use server";

import { db } from "@/utils/db.server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { UserNameAndNotedId } from "@/components/notes/EditForm";

export async function getUserName(userName: string) {
  try {
    const user = db.user.findFirst({
      where: {
        username: {
          equals: userName,
        },
      },
    });

    return NextResponse.json({
      user: { name: user?.name, username: user?.username },
    });
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

    const notes = db.note
      .findMany({
        where: {
          owner: {
            username: {
              equals: userName,
            },
          },
        },
      })
      .map(({ id, title }) => ({ id, title }));
    return NextResponse.json({ owner, notes });
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
    return NextResponse.json({
      note: { title: note?.title, content: note?.content },
    });
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

type UpdateNote = (
  prevState: UserNameAndNotedId,
  formData: FormData
) => string | Promise<string>;

export const updateNote: UpdateNote = async (
  prevState: UserNameAndNotedId,
  formData: FormData
) => {
  const { noteId, userName } = prevState;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title) {
    throw new Response("Title must not be null", { status: 400 });
  }

  if (!content) {
    throw new Response("Content must not be null", { status: 400 });
  }

  console.log(title, content);
  const result = updateNoteInDB(noteId, title, content);
  if (result) {
    return redirect(`/users/${userName}/notes/${noteId}`);
  } else {
    return "Failed";
  }
};
