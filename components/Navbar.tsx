import Link from "next/link";

const Navbar = () => {
  return (
    <header className="container mx-auto py-6">
      <nav className="flex justify-between">
          <Link className="underline" href="/users">
              Koko notes users
        </Link>
        <Link className="underline" href="/users/kody/notes/cmcuzf8nn003blmcobl0z7p6i">
          Kody&apos;s Notes
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
