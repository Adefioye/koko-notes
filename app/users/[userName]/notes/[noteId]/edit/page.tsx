import { getNote } from "@/lib/action";
import React from "react";
import EditForm from "@/components/notes/EditForm";
import { NoteEditProps } from "@/utils/types";

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
