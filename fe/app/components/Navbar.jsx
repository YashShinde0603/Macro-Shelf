'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full flex justify-center pt-8">
      <nav
        className="
          flex items-center justify-between
          w-[1100px]
          rounded-3xl
          bg-[#244030]
          px-12
          py-5
          shadow-sm
        "
      >
        {/* Left group: App name */}
        <Link
          href="/"
          className="
            text-lg
            font-semibold
            tracking-wide
            text-white
            cursor-pointer
            hover:text-white
          "
        >
          MacroShelf
        </Link>

        {/* Right group: Pages */}
        <div className="flex items-center gap-6 text-md font-semibold">
          <NavLink href="/pantry">Pantry</NavLink>
          <NavLink href="/calculate">Calculate Requirements</NavLink>
          <NavLink href="/diet">Generate Diet</NavLink>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="
        relative
        text-white
        transition-colors
        duration-200
        hover:text-[#e0a423]

        after:absolute
        after:-bottom-1.5
        after:left-1/2
        after:h-[2px]
        after:w-0
        after:-translate-x-1/2
        after:bg-[#e0a423]
        after:transition-all
        after:duration-200
        hover:after:w-full
      "
    >
      {children}
    </Link>
  );
}
