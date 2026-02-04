'use client';

import Navbar from './Navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main style={{ padding: 24 }}>
        <h1>Diet App</h1>
        <p>What would you like to do?</p>

        <ul>
          <li>
            <Link href="/pantry">Manage Pantry</Link>
          </li>
          <li>
            <Link href="/calculate">Calculate Nutrition</Link>
          </li>
          <li>
            <Link href="/diet">Generate Diet</Link>
          </li>
        </ul>
      </main>
    </>
  );
}
