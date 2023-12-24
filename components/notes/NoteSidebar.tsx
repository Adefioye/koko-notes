"use client";

import { cn } from "@/utils/misc";
import { Note, User } from "@/utils/types";
import Link from "next/link";

import { notFound, usePathname } from "next/navigation";

type Props = {
  owner: User;
  notes: Note[];
};

const NoteSidebar = ({ owner, notes }: Props) => {
  const pathname = usePathname();
  const ownerDisplayName = owner?.username ?? owner?.name;
  const navLinkDefaultClassName =
    "line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl";

  if (!owner) {
    notFound();
  }

  console.log("Pathname: ", pathname);
  const isActive = (noteId: string) => {
    return pathname === `/users/${ownerDisplayName}/notes/${noteId}`;
  };

  return (
    <div className="relative col-span-1">
      <div className="absolute inset-0 flex flex-col">
        <Link
          href={`/users/${owner.username ?? owner.name}`}
          className="pb-4 pl-8 pr-4 pt-12"
        >
          <h1 className="text-base font-bold md:text-lg lg:text-left lg:text-2xl">
            {owner.username ?? owner.name}&apos;s Notes
          </h1>
        </Link>
        <ul className="overflow-y-auto overflow-x-hidden pb-12">
          {notes.map((note) => (
            <li key={note.id} className="p-1 pr-0">
              <Link
                href={`/users/${owner.username ?? owner.name}/notes/${note.id}`}
                className={cn(
                  navLinkDefaultClassName,
                  isActive(note.id) && "bg-accent"
                )}
              >
                {note.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NoteSidebar;
