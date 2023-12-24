import { getNote } from "@/lib/action";
import React from "react";
import EditForm from "@/components/notes/EditForm";

export type NoteEditProps = {
  params: { userName: string; noteId: string };
};

const NoteEdit = async ({ params }: NoteEditProps) => {
  const { userName, noteId } = params;
  const initialState = { userName, noteId };
  const data = await getNote(params.noteId);
  const { note } = await data.json();

  return (
    <>
      <EditForm initialState={initialState} note={note} />
    </>
  );
};

export default NoteEdit;
