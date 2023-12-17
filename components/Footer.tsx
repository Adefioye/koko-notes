"use client";

import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full">
      <Link href={`/`} className="font-bold">
        Footer
      </Link>
    </footer>
  );
};

export default Footer;
