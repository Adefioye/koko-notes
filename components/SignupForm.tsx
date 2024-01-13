"use client";

import { signUp } from "@/lib/action";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";

const initialState = {
  message: "",
};

const SignupForm = () => {
    // @ts-expect-error // TODO: Fix typescript error 
  const [_, formAction] = useFormState(signUp, initialState);
  return (
    <form
      action={formAction}
      className="mx-auto flex min-w-[368px] max-w-sm flex-col gap-4"
    >
      {/* Honeypot */}
      <div className="hidden">
        <label htmlFor="name-input">
          <input id="name-input" type="text" name="name__confirm" />
        </label>
      </div>
      <div>
        <Label htmlFor="email-input">Email</Label>
        <Input autoFocus id="email-input" name="email" type="email" />
      </div>
      <Button className="w-full" type="submit">
        Create an account
      </Button>
    </form>
  );
};

export default SignupForm;
