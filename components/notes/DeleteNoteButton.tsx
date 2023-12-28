"use client";

import React from "react";
import { Button } from "../ui/button";
import { useFormState } from "react-dom";
import { deleteNote } from "@/lib/action";
import { UserNameAndNotedId } from "./EditForm";

const DeleteNoteButton = ({ noteId, userName }: UserNameAndNotedId) => {
  const initialState = { userName, noteId };
  // @ts-expect-error //TODO Fix typing of deleteNote action
  const [_, formAction] = useFormState(deleteNote, initialState);
  return (
    <form action={formAction}>
      <Button type="submit" variant="destructive">
        Delete
      </Button>
    </form>
  );
};

export default DeleteNoteButton;
