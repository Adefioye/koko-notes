"use client";

import React from "react";
import { Button } from "../ui/button";
import { updateNote } from "@/lib/action";
import { useFormState } from "react-dom";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export type UserNameAndNotedId = {
  userName: string;
  noteId: string;
};

type Props = {
  initialState: UserNameAndNotedId;
  note: { title: string; content: string };
};

const EditForm = ({ initialState, note }: Props) => {
  // @ts-expect-error //TODO Error with typing updateNote action properly
  const [_, formAction] = useFormState(updateNote, initialState);

  return (
    <form
      action={formAction}
      className="flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pb-28 pt-12"
    >
      <div className="flex flex-col gap-1">
        <div>
          {/* 🦉 NOTE: this is not an accessible label, we'll get to that in the accessibility exercises */}
          <Label>Title</Label>
          <Input name="itle" defaultValue={note.title} />
        </div>
        <div>
          {/* 🦉 NOTE: this is not an accessible label, we'll get to that in the accessibility exercises */}
          <Label>Content</Label>
          <Textarea name="content" defaultValue={note.content} />
        </div>
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-lg bg-muted/80 p-4 pl-5 shadow-xl shadow-accent backdrop-blur-sm md:gap-4 md:pl-7 justify-end">
        <Button variant="destructive" type="reset">
          Reset
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default EditForm;
