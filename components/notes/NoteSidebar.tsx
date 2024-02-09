"use client";

import { cn, getUserImgSrc } from "@/utils/misc";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import Image from "next/image";

type Props = {
  owner: {
    name: string | null;
    username: string;
    image: { id: string } | null;
    notes: {
      id: string;
      title: string;
    }[];
  } | null;
};

const NoteSidebar = ({ owner }: Props) => {
  const pathname = usePathname();
  const ownerDisplayName = owner?.username ?? owner?.name;
  const navLinkDefaultClassName =
    "line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl";

  if (!owner) {
    notFound();
  }

  const isActive = (noteId: string) => {
    return pathname.includes(`/users/${ownerDisplayName}/notes/${noteId}`);
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
          <Image
            height={0}
            width={0}
            src={getUserImgSrc(owner.image?.id)}
            alt={ownerDisplayName ?? ""}
            className="h-16 w-16 rounded-full object-cover lg:h-24 lg:w-24"
          />
        </Link>
        <ul className="overflow-y-auto overflow-x-hidden pb-12">
          {owner?.notes.map((note) => (
            <li key={note.id} className="p-1 pr-0">
              <Link
                href={`/users/${owner.username ?? owner.name}/notes/${note.id}`}
                className={cn(
                  navLinkDefaultClassName,
                  isActive(note.id) && "bg-accent"
                )}
                scroll={false}
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
