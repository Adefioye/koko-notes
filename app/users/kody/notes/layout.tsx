export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-screen justify-between pb-12 border-8 border-blue-500">
      <h1 className="text-h1">Notes</h1>
      {children}
    </section>
  );
}
