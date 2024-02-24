"use client";

import Link from "next/link";
import React from "react";
import ThemeToggle from "./ThemeToggle";

const Footer = () => {
  return (
    <footer className="container mx-auto flex justify-between">
      <Link href="/">
        <div className="font-light">epic</div>
        <div className="font-bold">notes</div>
      </Link>
      <div className="flex  items-center space-x-2">
        <p>Built with ♥️ by Kody</p>
        <ThemeToggle />
      </div>
    </footer>
  );
};

export default Footer;
