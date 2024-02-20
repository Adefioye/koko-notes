import Searchbar from "@/components/Searchbar";
import { searchUser } from "@/lib/action";
import { cn, getUserImgSrc } from "@/utils/misc";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const UsersPage = async ({
  searchParams,
}: {
  searchParams?: { query?: string };
}) => {
  const query = searchParams?.query ?? "";
  const { users } = await searchUser(query);

  console.log("query, users: ", query, users);
  return (
    <div>
      <Searchbar />
      <main>
        {users.length ? (
          <ul
            className={cn(
              "flex w-full flex-wrap items-center justify-center gap-4 delay-200"
            )}
          >
            {users.map((user) => (
              <li key={user.id}>
                <Link
                  href={`/users/${user.username}`}
                  className="flex h-36 w-44 flex-col items-center justify-center rounded-lg bg-muted px-5 py-3"
                >
                  <Image
                    alt={user.name ?? user.username}
                    // @ts-expect-error
                    src={getUserImgSrc(user.image?.id) ?? ""}
                    className="h-16 w-16 rounded-full"
                    priority
                  />
                  {user.name ? (
                    <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-body-md">
                      {user.name}
                    </span>
                  ) : null}
                  <span className="w-full overflow-hidden text-ellipsis text-center text-body-sm text-muted-foreground">
                    {user.username}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found</p>
        )}
      </main>
    </div>
  );
};

export default UsersPage;
