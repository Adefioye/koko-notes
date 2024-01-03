"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type Props = {
  children?: React.ReactNode;
  disableEditButton: boolean;
};

const StatusButton = ({ children, disableEditButton }: Props) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={disableEditButton || pending}
      className="flex justify-center gap-2"
    >
      {children}
      {pending && <span className="inline-block animate-spin">🌀</span>}
    </Button>
  );
};

export default StatusButton;
