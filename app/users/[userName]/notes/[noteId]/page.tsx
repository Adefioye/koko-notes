import StatusButton from "@/components/SubmitButton";
import DeleteNoteButton from "@/components/notes/DeleteNoteButton";
import { Button } from "@/components/ui/button";
import { getNote } from "@/lib/action";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SomeNoteId({
  params,
}: {
  params: { userName: string; noteId: string };
}) {
  const { userName, noteId } = params;
  const data = await getNote(noteId);
  const { note } = await data.json();

  if (!(note.title && note.content)) {
    notFound();
  }

  return (
    <form className="absolute inset-0 flex flex-col px-10">
      <h2 className="mb-2 pt-12 text-h2 lg:mb-6">{note.title}</h2>
      <div className="overflow-y-auto pb-24">
        <p className="whitespace-break-spaces text-sm md:text-lg">
          {note.content}
        </p>
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-lg bg-muted/80 p-4 pl-5 shadow-xl shadow-accent backdrop-blur-sm md:gap-4 md:pl-7 justify-end">
        <DeleteNoteButton noteId={noteId} userName={userName} />
        <Button asChild>
          <Link href={`/users/${userName}/notes/${noteId}/edit`}>Edit</Link>
        </Button>
      </div>
    </form>
  );
}
