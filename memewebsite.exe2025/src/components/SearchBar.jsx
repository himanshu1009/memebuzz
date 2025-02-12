'use client'
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", query);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="relative flex items-center border-b border-gray-400 w-1/3">
        <input
          className="w-full p-2 bg-transparent focus:outline-none text-lg"
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="ml-2 text-gray-500 hover:text-black"
          onClick={handleSearch}
        >
          🔍
        </button>
      </div>
    </div>
  );
}
