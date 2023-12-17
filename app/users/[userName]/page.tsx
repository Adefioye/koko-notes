import Link from "next/link";

export default function KodyProfileRoute({
  params,
}: {
  params: { userName: string };
}) {
  return (
    <div className="flex min-h-screen justify-between pb-12 border-8 border-green-500">
      <h1 className="text-2xl font-bold">{params.userName}</h1>
      <Link href="/users/kody/notes" className="font-bold text-red-500">
        Go to notes page
      </Link>
    </div>
  );
}
