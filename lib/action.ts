import "server-only";

import { db } from "@/utils/db.server";
import { NextResponse } from "next/server";

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
