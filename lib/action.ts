"use server";

import { db } from "@/utils/db.server";
import { invariantResponse } from "@/utils/misc";

export async function getUserName(userName: string) {
  try {
    const user = db.user.findFirst({
      where: {
        username: {
          equals: userName,
        },
      },
    });

    return { user: { name: user?.name, username: user?.username } };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
