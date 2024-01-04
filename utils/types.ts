import { z } from "zod";

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

export const editFormSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(5).max(10000),
});

export type UserNameAndNotedId = {
  userName: string;
  noteId: string;
};

export type OwnerAndNotes = {
  owner: User | null;
  notes: Note[];
};
