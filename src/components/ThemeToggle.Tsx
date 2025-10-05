"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("halalhive");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <button
      className="btn btn-sm btn-outline"
      onClick={() =>
        setTheme(theme === "halalhive" ? "light" : "halalhive")
      }
    >
      {theme === "halalhive" ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}