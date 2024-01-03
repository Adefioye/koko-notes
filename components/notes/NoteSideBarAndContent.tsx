import React from "react";
import NoteSidebar from "./NoteSidebar";
import NoteContent from "./NoteContent";
import { getOwnerAndNotes } from "@/lib/action";
import { OwnerAndNotes } from "@/utils/types";

type Props = {
  params: { userName: string };
  children: React.ReactNode;
};

const NoteSideBarAndContent = async ({ children, params }: Props) => {
  const data = await getOwnerAndNotes(params.userName);
  const { owner, notes }: OwnerAndNotes = await data.json();

  return (
    <div className="grid w-full grid-cols-4 bg-muted pl-2 md:container md:mx-2 md:rounded-3xl md:pr-0">
      <NoteSidebar owner={owner} notes={notes} />
      <NoteContent>{children}</NoteContent>
    </div>
  );
};

export default NoteSideBarAndContent;
