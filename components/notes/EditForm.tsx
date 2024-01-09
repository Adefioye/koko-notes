"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { useFormState } from "react-dom";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import StatusButton from "../SubmitButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  UserNameAndNotedId,
  NoteEditorSchema,
  Note,
  TNoteEditor,
} from "@/utils/types";
import ImageChooser from "../ImageChooser";

type Props = {
  initialState: UserNameAndNotedId;
  note: Note;
};

const EditForm = ({ initialState, note }: Props) => {
  const [_, formAction] = useFormState(updateNote, initialState);
  const formId = "note-editor";
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<TNoteEditor>({
    mode: "onBlur",
    resolver: zodResolver(NoteEditorSchema),
    defaultValues: {
      title: note.title,
      content: note.content,
      images: note.images?.length ? note.images : [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const { formState } = form;
  const { isDirty, isValid } = formState;
  const disableEditButton = !(isDirty && isValid);

  // useEffect(() => {
  //   const formEl = formRef.current;

  //   if (!formEl) return;

  //   // Focus on first field with invalia input onBlur
  //   const firstInvalidFormEl = formEl.querySelector('[aria-invalid="true"]');
  //   if (firstInvalidFormEl instanceof HTMLElement) {
  //     firstInvalidFormEl.focus();
  //   }
  // }, [formState]);

  console.log("Fields, note: ", fields.length, note);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        id={formId}
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
                  <Input
                    autoFocus
                    placeholder="Title"
                    {...field}
                    name="title"
                  />
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
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <ul className="flex flex-col gap-4">
                  {fields.map((field, index) => (
                    <li
                      key={field.id}
                      className="relative border-b-2 border-muted-foreground"
                    >
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-foreground-destructive absolute right-0 top-0"
                      >
                        <span aria-hidden>❌</span>{" "}
                        <span className="sr-only">
                          Remove image {index + 1}
                        </span>
                      </button>
                      <ImageChooser />
                    </li>
                  ))}
                </ul>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="mt-3"
          type="button"
          onClick={() => append({ altText: "" })}
        >
          <span aria-hidden>➕ Image</span>{" "}
          <span className="sr-only">Add image</span>
        </Button>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-lg bg-muted/80 p-4 pl-5 shadow-xl shadow-accent backdrop-blur-sm md:gap-4 md:pl-7 justify-end">
          <Button
            onClick={() => form.reset()}
            variant="destructive"
            type="reset"
          >
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
