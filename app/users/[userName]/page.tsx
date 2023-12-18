import Link from "next/link";
import { getUserName } from "@/lib/action";
import { notFound } from "next/navigation";

export default async function KodyProfileRoute({
  params,
}: {
  params: { userName: string };
}) {
  // TODO Grab data from database and display name/username property
  const { user } = await getUserName(params.userName);

  console.log("Params: ", params.userName);
  console.log(user);

  if (!(user.name || user.username)) {
    notFound();
  }

  return (
    <div className="container mb-48 mt-36">
      <h1 className="text-h1">{user?.name ?? user?.username}</h1>
      <Link href={`/users/${params.userName}/notes`} className="underline">
        Notes
      </Link>
    </div>
  );
}
