"use client";

import React, { PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

const StatusButton = ({ children }: PropsWithChildren) => {
  const { pending } = useFormStatus();

  console.log(pending);
  return (
    <Button
      type="submit"
      disabled={pending}
      className="flex justify-center gap-2"
    >
      {children}
      {pending && <span className="inline-block animate-spin">🌀</span>}
    </Button>
  );
};

export default StatusButton;
