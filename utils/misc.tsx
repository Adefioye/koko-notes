import { type ClassValue, clsx } from "clsx";
import path from "path";
import fs from "node:fs/promises";
import os from "os";
import { twMerge } from "tailwind-merge";
import userFallback from "./../public/user.png";
import { ImageFieldSet } from "./types";

export function getUserImgSrc(imageId?: string | null) {
  return imageId ? `/resources/user-images/${imageId}` : userFallback;
}

export function getNoteImgSrc(imageId: string) {
  return `/resources/note-images/${imageId}`;
}

export function hasImageFile(
  image: ImageFieldSet
): image is ImageFieldSet & { file: NonNullable<ImageFieldSet["file"]> } {
  return Boolean(image?.file?.size && image.file.size > 0);
}

export function hasImageId(
  image: ImageFieldSet
): image is ImageFieldSet & { id: NonNullable<ImageFieldSet["id"]> } {
  return Boolean(image.id);
}

/**
 * Does its best to get a string error message from an unknown error.
 */
export function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  console.error("Unable to get error message for error", error);
  return "Unknown Error";
}

/**
 * A handy utility that makes constructing class names easier.
 * It also merges tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Provide a condition and if that condition is falsey, this throws a 400
 * Response with the given message.
 *
 * inspired by invariant from 'tiny-invariant'
 *
 * @example
 * invariantResponse(typeof value === 'string', `value must be a string`)
 *
 * @param condition The condition to check
 * @param message The message to throw
 * @param responseInit Additional response init options if a response is thrown
 *
 * @throws {Response} if condition is falsey
 */
export function invariantResponse(
  condition: any,
  message?: string | (() => string),
  responseInit?: ResponseInit
): asserts condition {
  if (!condition) {
    throw new Response(
      typeof message === "function"
        ? message()
        : message ||
          "An invariant failed, please provide a message to explain why.",
      { status: 400, ...responseInit }
    );
  }
}

export async function writeImage(image: File) {
  const tmpDir = path.join(os.tmpdir(), "epic-web", "images");
  await fs.mkdir(tmpDir, { recursive: true });

  const timestamp = Date.now();
  const filepath = path.join(tmpDir, `${timestamp}.${image.name}`);
  await fs.writeFile(filepath, Buffer.from(await image.arrayBuffer()));
  return filepath;
}

/**
 * Returns true if the current navigation is submitting the current route's
 * form. Defaults to the current route's form action and method POST.
 */
// export function useIsSubmitting({
//   formAction,
//   formMethod = "POST",
// }: {
//   formAction?: string;
//   formMethod?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
// } = {}) {
//   const contextualFormAction = useFormAction();
//   const navigation = useNavigation();
//   return (
//     navigation.state === "submitting" &&
//     navigation.formAction === (formAction ?? contextualFormAction) &&
//     navigation.formMethod === formMethod
//   );
// }
