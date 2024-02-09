import { prisma } from "../../../../utils/db.server";
import { invariantResponse } from "@/utils/misc";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  context: { params: { imageId: string } }
) {
  const { imageId } = context.params;
  invariantResponse(imageId, "ImageID is required", { status: 400 });

  const image = await prisma.noteImage.findUnique({
    select: { contentType: true, blob: true },
    where: { id: imageId },
  });

  invariantResponse(image, "Image not found", { status: 404 });
  console.log(image);

  const res = new NextResponse(image.blob, {
    status: 200,
    headers: new Headers({
      "content-type": Buffer.byteLength(image.blob).toString(),
      "content-disposition": `inline; filename="${imageId}"`,
      "cache-control": "public, max-age=31536000, immutable",
    }),
  });

  return res;
}
