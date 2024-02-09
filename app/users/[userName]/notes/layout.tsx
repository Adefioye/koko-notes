import NoteSideBarAndContent from "@/components/notes/NoteSideBarAndContent";
import { getOwnerAndNotes } from "@/lib/action";

type Props = {
  children: React.ReactNode;
  params: {
    userName: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const { owner } = await getOwnerAndNotes(params.userName);
  const numOfNotes = owner?.notes ? owner.notes.length : 0;
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
