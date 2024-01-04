import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested note for current user</p>
      <Link
        href="/"
        className="mt-4 rounded-md px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-400 transition-colors"
      >
        Go Back
      </Link>
    </main>
  );
}
