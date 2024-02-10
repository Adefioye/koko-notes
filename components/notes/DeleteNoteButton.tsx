"use client";

import React from "react";
import { Button } from "../ui/button";
import { deleteNote } from "@/lib/action";
import { UserNameAndNotedId } from "@/utils/types";

const DeleteNoteButton = ({ noteId, userName }: UserNameAndNotedId) => {
  const initialState = { userName, noteId };
  const deleteNoteWithUsernameAndNoteId = deleteNote.bind(null, initialState)
  
  return (
    <form action={deleteNoteWithUsernameAndNoteId }>
      <Button type="submit" variant="destructive" name="intent" value="delete">
        Delete
      </Button>
    </form>
  );
};

export default DeleteNoteButton;
