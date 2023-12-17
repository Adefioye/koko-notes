import Link from "next/link";

type Props = {
  children: React.ReactNode;
  params: {
    userName: string;
  };
};

export default function NotesLayout({ children, params }: Props) {
  return (
    <section className="flex min-h-screen justify-between pb-12 border-8 border-blue-500">
      <div>
        <h1 className="text-h1">Notes</h1>
        <Link href="/users/kody" className="text-green-500 font-bold">
          Go to {params.userName}&apos;s page
        </Link>
        <Link
          href="/users/kody/notes/some-note-id"
          className="block text-red-500 font-bold"
        >
          Go to specific note page
        </Link>
      </div>

      {children}
    </section>
  );
}
