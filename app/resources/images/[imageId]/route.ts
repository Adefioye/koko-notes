import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  context: { params: { imageId: string } }
) {
  const { imageId } = context.params;
  return NextResponse.json({ message: `Cool ${imageId}` });
}
