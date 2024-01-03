"use client";

import React from "react";
import { Button } from "../ui/button";
import { useFormState } from "react-dom";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import StatusButton from "../SubmitButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { updateNote } from "@/lib/action";
import { UserNameAndNotedId, editFormSchema } from "@/utils/types";

type Props = {
  initialState: UserNameAndNotedId;
  note: { title: string; content: string };
};

const EditForm = ({ initialState, note }: Props) => {
  // @ts-expect-error //TODO Error with typing updateNote action properly
  const [_, formAction] = useFormState(updateNote, initialState);

  const form = useForm<z.infer<typeof editFormSchema>>({
    mode: "onBlur",
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      title: note.title,
      content: note.content,
    },
  });

  const disableEditButton = !(form.formState.isDirty && form.formState.isValid);

  return (
    <Form {...form}>
      <form
        action={formAction}
        className="flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pb-28 pt-12"
      >
        <div className="flex flex-col gap-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} name="title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your content here..."
                    {...field}
                    name="content"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-lg bg-muted/80 p-4 pl-5 shadow-xl shadow-accent backdrop-blur-sm md:gap-4 md:pl-7 justify-end">
          <Button variant="destructive" type="reset">
            Reset
          </Button>
          <StatusButton disableEditButton={disableEditButton}>
            Submit
          </StatusButton>
        </div>
      </form>
    </Form>
  );
};

export default EditForm;
