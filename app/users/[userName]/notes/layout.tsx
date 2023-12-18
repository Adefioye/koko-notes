import { cn } from "@/utils/misc";
import Link from "next/link";
import { getOwnerAndNotes } from "@/lib/action";
import { notFound } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: {
    userName: string;
  };
};

export default async function NotesLayout({ children, params }: Props) {
  const { owner, notes } = await getOwnerAndNotes(params.userName);

  if (!owner) {
    notFound();
  }
  return (
    <main className="container flex h-full min-h-[400px] pb-12 px-0 md:px-8">
      <div className="grid w-full grid-cols-4 bg-muted pl-2 md:container md:mx-2 md:rounded-3xl md:pr-0">
        <div className="relative col-span-1">
          <div className="absolute inset-0 flex flex-col">
            <Link
              href={`/users/${owner.username ?? owner.name}`}
              className="pb-4 pl-8 pr-4 pt-12"
            >
              <h1 className="text-base font-bold md:text-lg lg:text-left lg:text-2xl">
                {owner.name ?? owner.username}&apos;s Notes
              </h1>
            </Link>
            <ul className="overflow-y-auto overflow-x-hidden pb-12">
              {notes.map((note) => (
                <li key={note.id} className="p-1 pr-0">
                  <Link
                    href={note.id}
                    // className={({ isActive }) =>
                    //   cn(navLinkDefaultClassName, isActive && "bg-accent")
                    // }
                  >
                    {note.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative col-span-3 bg-accent md:rounded-r-3xl">
          {children}
        </div>
      </div>
    </main>
  );
}
