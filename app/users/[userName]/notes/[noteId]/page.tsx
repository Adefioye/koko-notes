

export default function SomeNoteId({ params }: { params: { noteId: string } }) {
  return (
    <div className="absolute inset-0 flex flex-col px-10">
      <h2 className="mb-2 pt-12 text-h2 lg:mb-6">
        Return notes title for the current noteId
      </h2>
      <div className="overflow-y-auto pb-24">
        <p className="whitespace-break-spaces text-sm md:text-lg">
          Note content should be inserted here
        </p>
      </div>
    </div>
  );
}
