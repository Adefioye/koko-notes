import React, { PropsWithChildren } from "react";

const NoteContent = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative col-span-3 bg-accent md:rounded-r-3xl">
      {children}
    </div>
  );
};

export default NoteContent;
