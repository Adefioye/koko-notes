import { PrismaClient } from "@prisma/client";
import path from "node:path";
import fs from "node:fs";
import { faker } from "@faker-js/faker";
import { Promise as BlueBirdPromise } from "bluebird";
import { UniqueEnforcer } from "enforce-unique";

const cwd = process.cwd();
const relativePathOfFile = "/public/images/";

const prisma = new PrismaClient();
const uniqueUsernameEnforcer = new UniqueEnforcer();

export function createUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  let username = uniqueUsernameEnforcer.enforce(() => {
    return faker.internet.userName({
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
    });
  });

  // Ensure its just 20 characters and replace non-alphanumeric character with underscore
  username = username
    .toLowerCase()
    .slice(0, 20)
    .replace(/[^a-z0-9]/g, "_");

  return {
    username,
    name: `${firstName} ${lastName}`,
    email: `${username}@example.com`,
  };
}

async function img({
  altText,
  filepath,
}: {
  altText?: string;
  filepath: string;
}) {
  return {
    altText,
    contentType: filepath.endsWith(".png") ? "image/png" : "image/jpeg",
    blob: await fs.promises.readFile(filepath),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function seed() {
  console.log("🌱 Seeding...");
  console.time(`🌱 Database has been seeded`);

  console.time("🧹 Cleaned up the database...");
  await prisma.user.deleteMany();
  console.timeEnd("🧹 Cleaned up the database...");

  const totalUsers = 5;
  console.time(`👤 Created ${totalUsers} users...`);
  const noteImages = await Promise.all([
    img({
      altText: "a nice country house",
      filepath: path.join(cwd, relativePathOfFile, "/notes/0.png"),
    }),
    img({
      altText: "a city scape",
      filepath: path.join(cwd, relativePathOfFile, "/notes/1.png"),
    }),
    img({
      altText: "a sunrise",
      filepath: path.join(cwd, relativePathOfFile, "/notes/2.png"),
    }),
    img({
      altText: "a group of friends",
      filepath: path.join(cwd, relativePathOfFile, "/notes/3.png"),
    }),
    img({
      altText: "friends being inclusive of someone who looks lonely",
      filepath: path.join(cwd, relativePathOfFile, "/notes/4.png"),
    }),
    img({
      altText: "an illustration of a hot air balloon",
      filepath: path.join(cwd, relativePathOfFile, "/notes/5.png"),
    }),
    img({
      altText:
        "an office full of laptops and other office equipment that look like it was abandond in a rush out of the building in an emergency years ago.",
      filepath: path.join(cwd, relativePathOfFile, "/notes/6.png"),
    }),
    img({
      altText: "a rusty lock",
      filepath: path.join(cwd, relativePathOfFile, "/notes/7.png"),
    }),
    img({
      altText: "something very happy in nature",
      filepath: path.join(cwd, relativePathOfFile, "/notes/8.png"),
    }),
    img({
      altText: `someone at the end of a cry session who's starting to feel a little better.`,
      filepath: path.join(cwd, relativePathOfFile, "/notes/9.png"),
    }),
  ]);

  const userImages = await Promise.all(
    Array.from({ length: 10 }, (_, index) =>
      img({
        filepath: path.join(cwd, relativePathOfFile, `/user/${index}.jpg`),
      })
    )
  );

  for (let i = 0; i < totalUsers; i++) {
    try {
      await prisma.user.create({
        data: {
          ...createUser(),
          image: {
            create: userImages[i % 10],
          },
          notes: {
            create: Array.from({
              length: faker.number.int({ min: 1, max: 3 }),
            }).map(() => ({
              title: faker.lorem.sentence(),
              content: faker.lorem.paragraphs(),
              images: {
                create: Array.from({
                  length: faker.number.int({ min: 1, max: 3 }),
                }).map(() => {
                  const imgNumber = faker.number.int({ min: 0, max: 9 });
                  return noteImages[imgNumber];
                }),
              },
            })),
          },
        },
      });
    } catch (error) {
      console.log("Error creating user: ", error);
    }
  }

  console.timeEnd(`👤 Created ${totalUsers} users...`);

  console.time(`🐨 Created user "kody"`);

  const kodyImages = await BlueBirdPromise.props({
    kodyUser: img({
      filepath: path.join(cwd, relativePathOfFile, "/user/kody.png"),
    }),
    cuteKoala: img({
      altText: "an adorable koala cartoon illustration",
      filepath: path.join(
        cwd,
        relativePathOfFile,
        "/kody-notes/cute-koala.png"
      ),
    }),
    koalaEating: img({
      altText: "a cartoon illustration of a koala in a tree eating",
      filepath: path.join(
        cwd,
        relativePathOfFile,
        "/kody-notes/koala-eating.png"
      ),
    }),
    koalaCuddle: img({
      altText: "a cartoon illustration of koalas cuddling",
      filepath: path.join(
        cwd,
        relativePathOfFile,
        "/kody-notes/koala-cuddle.png"
      ),
    }),
    mountain: img({
      altText: "a beautiful mountain covered in snow",
      filepath: path.join(cwd, relativePathOfFile, "/kody-notes/mountain.png"),
    }),
    koalaCoder: img({
      altText: "a koala coding at the computer",
      filepath: path.join(
        cwd,
        relativePathOfFile,
        "/kody-notes/koala-coder.png"
      ),
    }),
    koalaMentor: img({
      altText:
        "a koala in a friendly and helpful posture. The Koala is standing next to and teaching a woman who is coding on a computer and shows positive signs of learning and understanding what is being explained.",
      filepath: path.join(
        cwd,
        relativePathOfFile,
        "/kody-notes/koala-mentor.png"
      ),
    }),
    koalaSoccer: img({
      altText: "a cute cartoon koala kicking a soccer ball on a soccer field ",
      filepath: path.join(
        cwd,
        relativePathOfFile,
        "/kody-notes/koala-soccer.png"
      ),
    }),
  });

  await prisma.user.create({
    data: {
      email: "kody@kcd.dev",
      username: "kody",
      name: "Kody",
      image: {
        create: kodyImages.kodyUser,
      },
      notes: {
        create: [
          {
            id: "d27a197e",
            title: "Basic Koala Facts",
            content:
              "Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!",
            // 🐨 swap these hard-coded images for the ones in kodyImages
            images: {
              create: [kodyImages.cuteKoala, kodyImages.koalaEating],
            },
          },
        ],
      },
    },
  });
  console.timeEnd(`🐨 Created user "kody"`);

  console.timeEnd(`🌱 Database has been seeded`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
