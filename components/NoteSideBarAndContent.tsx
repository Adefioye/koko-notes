"use client";

import React from "react";
import NoteSidebar from "./NoteSidebar";
import NoteContent from "./NoteContent";
import { usePathname } from "next/navigation";

type Props = {
  params: { userName: string };
  children: React.ReactNode;
};

const NoteSideBarAndContent = ({ children, params }: Props) => {
  const pathname = usePathname();

  return (
    <div className="grid w-full grid-cols-4 bg-muted pl-2 md:container md:mx-2 md:rounded-3xl md:pr-0">
      <NoteSidebar params={params} pathname={pathname} />
      <NoteContent>{children}</NoteContent>
    </div>
  );
};

export default NoteSideBarAndContent;
