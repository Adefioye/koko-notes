"use client";

import React from "react";
import { Button } from "../ui/button";
import { useFormState } from "react-dom";
import { deleteNote } from "@/lib/action";
import { UserNameAndNotedId } from "@/utils/types";

const DeleteNoteButton = ({ noteId, userName }: UserNameAndNotedId) => {
  const initialState = { userName, noteId };
  const [_, formAction] = useFormState(deleteNote, initialState);
  return (
    <form action={formAction}>
      <Button type="submit" variant="destructive" name="intent" value="delete">
        Delete
      </Button>
    </form>
  );
};

export default DeleteNoteButton;
