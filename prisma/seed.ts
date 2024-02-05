import { PrismaClient } from "@prisma/client";
import path from "node:path";
import fs from "node:fs";

const cwd = process.cwd();
const relativePathOfFile = "/public/images/kody-notes";

const prisma = new PrismaClient();

async function addNoteImages() {
  // Delete all data in database, Since user is related all current models in prisma schema
  // We delete all users
  await prisma.user.deleteMany();

  // Create new user koko
  const koko = await prisma.user.create({
    data: {
      email: "koko@example.com",
      username: "koko",
      name: "Koko",
    },
  });
  const firstNote = await prisma.note.create({
    data: {
      id: "d27a197e",
      title: "Basic koala facts",
      content:
        "Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!",
      ownerId: koko.id,
    },
  });

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
