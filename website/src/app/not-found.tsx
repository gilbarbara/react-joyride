'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg text-default-500">Page not found</p>
      <Link className="text-primary underline" href="/">
        Go home
      </Link>
    </div>
  );
}
