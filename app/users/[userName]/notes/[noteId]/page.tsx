/* eslint-disable @next/next/no-img-element */
import DeleteNoteButton from "@/components/notes/DeleteNoteButton";
import { Button } from "@/components/ui/button";
import { getNote } from "@/lib/action";
import Link from "next/link";
import { notFound } from "next/navigation";
import { data } from "tailwindcss/defaultTheme";

type Props = {
  params: { userName: string; noteId: string };
};

export async function generateMetadata({ params }: Props) {
  const displayName = params.userName;
  const { note } = await getNote(params.noteId);
  const noteTitle = note?.title ?? "Note";
  const noteContent = (note?.content as string) ?? "No content";
  const noteContentSummary =
    noteContent && noteContent.length > 100
      ? noteContent.slice(0, 97) + "..."
      : noteContent;
  return {
    title: `${noteTitle} | ${displayName}'s note | Koko notes`,
    description: noteContentSummary,
  };
}

export default async function SomeNoteId({ params }: Props) {
  const { userName, noteId } = params;
  const { note } = await getNote(noteId);

  if (!note) {
    notFound();
  }

  return (
    <div className="absolute inset-0 flex flex-col px-10">
      <h2 className="mb-2 pt-12 text-h2 lg:mb-6">{note.title}</h2>
      <div className="overflow-y-auto pb-24">
        <ul className="flex flex-wrap gap-5 py-5">
          {note.images.map((image) => (
            <li key={image.id}>
              <a href={`/resources/images/${image.id}`}>
                <img
                  src={`/resources/images/${image.id}`}
                  alt={image.altText ?? ""}
                  className="h-32 w-32 rounded-lg object-cover"
                />
              </a>
            </li>
          ))}
        </ul>
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
    </div>
  );
}
