"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathName = usePathname();
  const currentRouteTokens = pathName.split("/");
  const currentRouteParam = currentRouteTokens[currentRouteTokens.length - 1];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">
        {currentRouteParam ? (
          <span className="text-3xl font-bold">
            Person with noteID {currentRouteParam} not found
          </span>
        ) : (
          <span className="text-3xl font-bold">Something went wrong</span>
        )}
      </h2>
      <div className="flex flex-col space-y-5 md:flex-row md:space-x-5 md:space-y-0 items-center justify-center p-8">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
          onClick={
            // Attempt to recover by trying to re-render edit note route
            () => reset()
          }
        >
          Try again
        </button>
        <Link
          href={"/"}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
