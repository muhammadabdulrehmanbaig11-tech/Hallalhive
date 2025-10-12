"use client";
export default function ThemeToggle() {
  const toggle = () => {
    const el = document.documentElement
    const current = el.getAttribute("data-theme") || "halalhive"
    el.setAttribute("data-theme", current === "halalhive" ? "halalhive-dark" : "halalhive")
  }
  return (
    <button className="btn btn-sm" onClick={toggle} aria-label="Toggle theme">
      🌓
    </button>
  )
}
