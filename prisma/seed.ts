import { PrismaClient } from "@prisma/client";
import path from "node:path";
import fs from "node:fs";

const cwd = process.cwd();
const relativePathOfFile = "/public/images/kody-notes";

const prisma = new PrismaClient();

async function addNoteImages() {
  const firstNote = await prisma.note.findFirst();

  console.log("First note: ", firstNote);

  if (!firstNote) {
    throw new Error("You need to have a note in the database first");
  }

  await prisma.note.update({
    where: { id: firstNote.id },
    data: {
      images: {
        create: [
          {
            altText: "an adorable koala cartoon illustration",
            contentType: "image/png",
            blob: await fs.promises.readFile(
              path.join(cwd, relativePathOfFile, "cute-koala.png")
            ),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            altText: "a cartoon illustration of a koala in a tree eating",
            contentType: "image/png",
            blob: await fs.promises.readFile(
              path.join(cwd, relativePathOfFile, "koala-eating.png")
            ),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
    },
  });

  console.log("Note images successfully inserted into note table");
}

// Invoke the function
addNoteImages();
