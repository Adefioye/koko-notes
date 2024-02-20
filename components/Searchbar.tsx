import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const Searchbar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  // To only fire handleSearch after 300ms has elapsed
  const handleSearch = useDebouncedCallback((term: string) => {
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <>
      <Label htmlFor="search">Search</Label>
      <Input
        type="text"
        placeholder="Search..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={params.get("query") ?? ""}
      />
    </>
  );
};

export default Searchbar;
