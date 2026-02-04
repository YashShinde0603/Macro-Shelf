'use client';

import Navbar from './Navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pt-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-[#244030]">
          MacroShelf
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-lg text-[#4B7447]">
          Plan your meals, manage ingredients, and generate structured diets
          based on your nutritional needs.
        </p>

        <ul className="mt-16 flex flex-col items-center gap-6">
          <li>
            <HomeLink href="/pantry">Manage Pantry</HomeLink>
          </li>
          <li>
            <HomeLink href="/calculate">Calculate Nutrition</HomeLink>
          </li>
          <li>
            <HomeLink href="/diet">Generate Diet</HomeLink>
          </li>
        </ul>
      </main>
    </div>
  );
}

function HomeLink({ href, children }) {
  return (
    <Link
      href={href}
      className="
        inline-block
        rounded-xl
        border
        border-[#244030]
        px-8
        py-4
        text-sm
        font-semibold
        text-[#244030]
        transition-colors
        duration-200
        hover:border-[#E0A423]
        hover:text-[#E0A423]
      "
    >
      {children}
    </Link>
  );
}
