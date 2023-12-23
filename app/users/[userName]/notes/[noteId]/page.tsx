import { getNote } from "@/lib/action";
import { notFound } from "next/navigation";

export default async function SomeNoteId({
  params,
}: {
  params: { noteId: string };
}) {
  const data = await getNote(params.noteId);
  const { note } = await data.json();

  if (!(note.title && note.content)) {
    notFound();
  }

  return (
    <div className="absolute inset-0 flex flex-col px-10">
      <h2 className="mb-2 pt-12 text-h2 lg:mb-6">{note.title}</h2>
      <div className="overflow-y-auto pb-24">
        <p className="whitespace-break-spaces text-sm md:text-lg">
          {note.content}
        </p>
      </div>
    </div>
  );
}
