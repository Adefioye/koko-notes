"use client";

import React from "react";
import { Button } from "../ui/button";
import { deleteNote } from "@/lib/action";
import { UserNameAndNotedId } from "@/utils/types";
import { useAction } from "next-safe-action/hook";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import result from "postcss/lib/result";

const DeleteNoteButton = ({ noteId, userName }: UserNameAndNotedId) => {
  const router = useRouter();
  const initialState = { userName, noteId };
  const { execute } = useAction(deleteNote, {
    onSuccess: (data) => {
      // Display toast for success / error
      console.log(data);
      if (data?.success) {
        toast({
          variant: "default",
          title: "Success",
          description: `${data.success}`,
        });
        router.push(`/users/${initialState.userName}/notes`);
      } else {
        toast({
          variant: "destructive",
          title: `Something went wrong`,
          description: `${data.error}`,
        });
      }
    },
  });

  function handleNoteDeletion(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const { value } = e.target as HTMLButtonElement;
    const input = {
      userName,
      noteId,
      intent: value,
    };

    execute(input);
  }

  return (
    <Button
      type="submit"
      variant="destructive"
      name="intent"
      value="delete"
      onClick={handleNoteDeletion}
    >
      Delete
    </Button>
  );
};

export default DeleteNoteButton;
