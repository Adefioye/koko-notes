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
  const initialNoteValues = {
    title: note.title,
    content: note.content,
    images: note.images?.length ? note.images : [{}],
  };

  const { register, formState, control, reset } = useForm<TNoteEditor>({
    mode: "onBlur",
    resolver: zodResolver(NoteEditorSchema),
    defaultValues: initialNoteValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const { isDirty, isValid, errors, touchedFields } = formState;

  const disableEditButton = !(isDirty && isValid);

  console.log(
    "Is dirty, valid, errors: ",
    isDirty,
    isValid,
    errors,
    touchedFields
  );

  // useEffect(() => {
  //   const formEl = formRef.current;

  //   if (!formEl) return;

  //   // Focus on first field with invalia input onBlur
  //   const firstInvalidFormEl = formEl.querySelector('[aria-invalid="true"]');
  //   if (firstInvalidFormEl instanceof HTMLElement) {
  //     firstInvalidFormEl.focus();
  //   }
  // }, [formState]);

  // console.log("Note images: ", note.images);
  // console.log("Field length, fields, note: ", fields.length, fields, note);

  return (
    <form
      ref={formRef}
      id={formId}
      action={formAction}
      className="flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pb-28 pt-12"
    >
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="">Title</label>
          <Input {...register("title")} placeholder="Title" />
          <p>{errors.title?.message}</p>
        </div>
        <div>
          <label htmlFor="">Content</label>
          <Textarea {...register("content")} placeholder="Title" />
          <p>{errors.content?.message}</p>
        </div>
        <ul className="flex flex-col gap-4">
          {fields.map((imageField, index) => (
            <li
              key={imageField.id}
              className="relative border-b-2 border-muted-foreground"
            >
              <button
                onClick={() => remove(index)}
                className="text-foreground-destructive absolute right-0 top-0"
              >
                <span aria-hidden>❌</span>{" "}
                <span className="sr-only">Remove image {index + 1}</span>
              </button>
              <ImageChooser register={register} index={index} />
            </li>
          ))}
        </ul>
      </div>
      <Button
        type="button"
        className="mt-3"
        onClick={() => append({ altText: "" })}
      >
        <span aria-hidden>➕ Image</span>{" "}
        <span className="sr-only">Add image</span>
      </Button>
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-lg bg-muted/80 p-4 pl-5 shadow-xl shadow-accent backdrop-blur-sm md:gap-4 md:pl-7 justify-end">
        <Button onClick={() => reset()} variant="destructive" type="reset">
          Reset
        </Button>
        <StatusButton disableEditButton={disableEditButton}>
          Submit
        </StatusButton>
      </div>
    </form>
  );
};

export default EditForm;
