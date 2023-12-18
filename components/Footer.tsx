"use client";

import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="container mx-auto flex justify-between">
      <Link href="/">
        <div className="font-light">epic</div>
        <div className="font-bold">notes</div>
      </Link>
      <p>Built with ♥️ by Kody</p>
    </footer>
  );
};

export default Footer;
