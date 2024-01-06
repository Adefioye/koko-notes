import fs, { Stats } from "fs";
import { db } from "@/utils/db.server";
import { invariantResponse } from "@/utils/misc";
import { NextRequest, NextResponse } from "next/server";
import { ReadableOptions } from "stream";
import path from "path";

/**
 * Return a stream from the disk
 * @param {string} path - The location of the file
 * @param {ReadableOptions} options - The streamable options for the stream (ie how big are the chunks, start, end, etc).
 * @returns {ReadableStream} A readable stream of the file
 */
function streamFile(
  path: string,
  options?: ReadableOptions
): ReadableStream<Uint8Array> {
  const downloadStream = fs.createReadStream(path, options);

  return new ReadableStream({
    start(controller) {
      downloadStream.on("data", (chunk: Buffer) =>
        controller.enqueue(new Uint8Array(chunk))
      );
      downloadStream.on("end", () => controller.close());
      downloadStream.on("error", (error: NodeJS.ErrnoException) =>
        controller.error(error)
      );
    },
    cancel() {
      downloadStream.destroy();
    },
  });
}

export async function GET(
  _: NextRequest,
  context: { params: { imageId: string } }
) {
  const { imageId } = context.params;
  invariantResponse(imageId, "Invalid imageId");

  const image = db.image.findFirst({
    where: { id: { equals: imageId } },
  });

  console.log(image);

  invariantResponse(image, "Image not found", { status: 404 });

  const { filepath, contentType } = image;
  const fileStat = await fs.promises.stat(filepath);
  const data: ReadableStream<Uint8Array> = streamFile(filepath);
  const res = new NextResponse(data, {
    status: 200,
    headers: new Headers({
      "content-type": contentType,
      "content-length": fileStat.size.toString(),
      "content-disposition": `inline; filename="${imageId}"`,
      "cache-control": "public, max-age=31536000, immutable",
    }),
  });

  return res;
}
