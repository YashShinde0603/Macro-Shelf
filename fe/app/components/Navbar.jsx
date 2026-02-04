'use client';


import Link from 'next/link';


export default function Navbar() {
return (
<nav style={{ padding: 16, borderBottom: '1px solid #ccc' }}>
<Link href="/pantry">Pantry</Link> |{' '}
<Link href="/calculate">Calculate Requirements</Link> |{' '}
<Link href="/diet">Generate Diet</Link>
</nav>
);
}