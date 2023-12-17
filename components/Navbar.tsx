"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full">
      <Link href={`/`} className="font-bold">
        KOKO NOTES
      </Link>
    </nav>
  );
};

export default Navbar;
