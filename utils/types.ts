import { z } from "zod";

export const TITLE_MAX_LENGTH = 100
export const CONTENT_MAX_LENGTH = 10000

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

export type User = {
  id: string;
  email: string;
  username: String;
  name?: string;
  createdAt: Date;
  notes: string;
};

export type Note = {
  id: string;
  title: string;
  content?: string;
  createdAt?: Date;
  owner?: string;
};

export type NoteEditProps = {
  params: { userName: string; noteId: string };
};

export const NoteEditorSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(5).max(10000),
  imageId: z.string().optional(),
	file: z
		.instanceof(File)
		.refine(file => {
			return file.size <= MAX_UPLOAD_SIZE
		}, 'File size must be less than 3MB')
		.optional(),
	altText: z.string().optional(),
});

export type UserNameAndNotedId = {
  userName: string;
  noteId: string;
};

export type OwnerAndNotes = {
  owner: User | null;
  notes: Note[];
};
