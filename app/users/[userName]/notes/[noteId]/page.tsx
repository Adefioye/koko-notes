export default function SomeNoteId({ params }: { params: { noteId: string } }) {
  return (
    <div className="container pt-12 border-8 border-red-500">
      <h2 className="text-h2">{params.noteId}</h2>
    </div>
  );
}
