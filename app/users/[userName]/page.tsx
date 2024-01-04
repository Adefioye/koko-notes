import Link from "next/link";
import { getUserName } from "@/lib/action";
import { notFound } from "next/navigation";
import { data } from "tailwindcss/defaultTheme";

type Props = {
  params: { userName: string };
};

export async function generateMetadata({ params }: Props) {
  return {
    title: `${params.userName ?? "Profile"} | Koko notes`,
    description: `Profile of ${
      params.userName ?? "Unknown person"
    } in koko notes`,
  };
}

export default async function KodyProfileRoute({ params }: Props) {
  const { user } = await getUserName(params.userName);

  if (!user) {
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
