import { getNote } from "@/lib/action";
import React from "react";
import EditForm from "@/components/notes/EditForm";
import { NoteEditProps } from "@/utils/types";
import { notFound } from "next/navigation";

const NoteEdit = async ({ params }: NoteEditProps) => {
  const { userName, noteId } = params;
  const initialState = { userName, noteId };
  const { note } = await getNote(params.noteId);

  if (!note) {
    notFound();
  }

  return (
    <>
      <EditForm initialState={initialState} note={note} />
    </>
  );
};

export default NoteEdit;
