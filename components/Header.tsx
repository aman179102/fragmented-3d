"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="#top"
          className="flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-slate-200"
          aria-label="Go to top"
        >
          <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_60px_rgba(56,189,248,0.75)]" />
          FRAGMENTED
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <li>
              <a href="#concept" className="hover:text-slate-100">
                Concept
              </a>
            </li>
            <li>
              <a href="#engineering" className="hover:text-slate-100">
                Engineering
              </a>
            </li>
            <li>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="hidden rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-200 hover:border-sky-500 hover:text-sky-400 sm:inline-block"
              >
                View Source (example)
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
