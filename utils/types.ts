import Image from "next/image";
import { z } from "zod";

export const TITLE_MIN_LENGTH = 5;
export const CONTENT_MIN_LENGTH = 5;
export const TITLE_MAX_LENGTH = 100;
export const CONTENT_MAX_LENGTH = 10000;

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export type User = {
  id: string;
  email: string;
  username: String;
  name?: string;
  createdAt?: Date;
  notes?: string;
};

export type Image = {
  id?: string;
  filepath?: string;
  contentType?: string;
  altText?: string;
};

export type Note = {
  id: string;
  title: string;
  content?: string;
  createdAt?: Date;
  owner?: string;
  images?: Image[];
};

export type NoteEditProps = {
  params: { userName: string; noteId: string };
};

const ImageFieldSetSchema = z.object({
  id: z.string().optional(),
  file: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB"),
  altText: z.string().optional(),
});

export type ImageFieldSet = z.infer<typeof ImageFieldSetSchema>;

export const NoteEditorSchema = z.object({
  title: z.string().min(TITLE_MIN_LENGTH).max(TITLE_MAX_LENGTH),
  content: z.string().min(CONTENT_MIN_LENGTH).max(CONTENT_MAX_LENGTH),
  makeImageDirtyWhenSet: z.string().optional(),
  images: z.array(ImageFieldSetSchema).max(5).optional(),
});

export type TNoteEditor = z.infer<typeof NoteEditorSchema>;

export type UserNameAndNotedId = {
  userName: string;
  noteId: string;
};

export type OwnerAndNotes = User & { notes: Note[] };

const UserSearchResultSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string().nullable()
})

export const UserSearchResultsSchema = z.array(UserSearchResultSchema)
