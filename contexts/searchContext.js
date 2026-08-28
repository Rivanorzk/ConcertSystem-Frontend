"use client";

import { createContext, useContext, useState } from "react";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

/**
 * Hook untuk ambil/ubah nilai search dari mana saja
 * yang berada di dalam <SearchProvider>.
 *
 * Contoh pakai di Navbar:
 *   const { search, setSearch } = useSearch();
 *
 * Contoh pakai di page untuk filter data:
 *   const { search } = useSearch();
 */
export function useSearch() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      "useSearch harus dipakai di dalam <SearchProvider> (biasanya sudah dibungkus otomatis oleh UserLayout)."
    );
  }

  return context;
}