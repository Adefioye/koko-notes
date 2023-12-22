import NoteSideBarAndContent from "@/components/NoteSideBarAndContent";

type Props = {
  children: React.ReactNode;
  params: {
    userName: string;
  };
};

export default function NotesLayout({ children, params }: Props) {
  return (
    <main className="container flex h-full min-h-[400px] pb-12 px-0 md:px-8">
      <NoteSideBarAndContent params={params}>{children}</NoteSideBarAndContent>
    </main>
  );
}
