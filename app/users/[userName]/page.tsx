import Link from "next/link";

export default function KodyProfileRoute({
  params,
}: {
  params: { userName: string };
}) {
  // TODO Grab data from database and display name/username property

  
  return (
    <div className="container mb-48 mt-36">
      <h1 className="text-h1">user or username from data</h1>
      <Link href={`/users/${params.userName}/notes`} className="underline">
        Notes
      </Link>
    </div>
  );
}
