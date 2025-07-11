import React from "react";
import NoteSidebar from "./NoteSidebar";
import NoteContent from "./NoteContent";
import { getOwnerAndNotes } from "@/lib/action";

type Props = {
  params: { userName: string };
  children: React.ReactNode;
};

const NoteSideBarAndContent = async ({ children, params }: Props) => {
  const { owner } = await getOwnerAndNotes(params.userName);

  return (
    <div className="grid w-full grid-cols-4 bg-muted pl-2 md:container md:mx-2 md:rounded-3xl md:pr-0">
      <NoteSidebar owner={owner} />
      <NoteContent>{children}</NoteContent>
    </div>
  );
};

export default NoteSideBarAndContent;
