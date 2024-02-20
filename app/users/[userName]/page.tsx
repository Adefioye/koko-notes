import Link from "next/link";
import { getUserName } from "@/lib/action";
import { notFound } from "next/navigation";
import { data } from "tailwindcss/defaultTheme";
import { Button } from "@/components/ui/button";
import { Spacer } from "@/components/Spacer";
import Image from "next/image";
import { getUserImgSrc } from "@/utils/misc";

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

export default async function UserProfilePage({ params }: Props) {
  const { user } = await getUserName(params.userName);
  const userDisplayName = user?.name ?? user?.username;
  const userJoinedDisplay = user?.createdAt.toLocaleDateString();

  if (!user) {
    notFound();
  }

  return (
    <div className="container mb-48 mt-36 flex flex-col items-center justify-center">
      <Spacer size="4xs" />

      <div className="container flex flex-col items-center rounded-3xl bg-muted p-12">
        <div className="relative w-52">
          <div className="absolute -top-40">
            <div className="relative">
              <Image
                height={0}
                width={0}
                src={getUserImgSrc(user.image?.id)}
                alt={userDisplayName ?? ""}
                className="h-52 w-52 rounded-full object-cover"
                unoptimized
                priority
              />
            </div>
          </div>
        </div>

        <Spacer size="sm" />

        <div className="flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <h1 className="text-center text-h2">{userDisplayName}</h1>
          </div>
          <p className="mt-2 text-center text-muted-foreground">
            Joined {userJoinedDisplay}
          </p>
          <div className="mt-10 flex gap-4">
            <Button asChild>
              <Link href={`/users/${user?.username}/notes`}>
                {userDisplayName}&apos;s notes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
