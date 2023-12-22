import Link from "next/link";

const Navbar = () => {
  return (
    <header className="container mx-auto py-6">
      <nav className="flex justify-between">
        <Link href="/">
          <div className="font-light">epic</div>
          <div className="font-bold">notes</div>
        </Link>
        <Link className="underline" href="/users/kody/notes/d27a197e">
          Kody&apos;s Notes
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
