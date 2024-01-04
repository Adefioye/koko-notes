// @ts-nocheck //TODO Fix error on owner and notes variable

import NoteSideBarAndContent from "@/components/notes/NoteSideBarAndContent";
import { OwnerAndNotes } from "@/utils/types";
import { getOwnerAndNotes } from "@/lib/action";

type Props = {
  children: React.ReactNode;
  params: {
    userName: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const {owner, notes}: OwnerAndNotes = await getOwnerAndNotes(params.userName);
  const numOfNotes = notes.length;
  const displayName = params.userName;
  const notesText = numOfNotes === 0 ? "note" : "notes";
  return {
    title: `${displayName}'s note | Koko notes`,
    description: `Checkout ${
      displayName + "'s" ?? "Unknown person"
    } ${numOfNotes} ${notesText} on koko notes`,
  };
}

export default function NotesLayout({ children, params }: Props) {
  return (
    <main className="container flex h-full min-h-[400px] pb-12 px-0 md:px-8">
      <NoteSideBarAndContent params={params}>{children}</NoteSideBarAndContent>
    </main>
  );
}
