import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <nav className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" aria-label="MAMPU.IO home" className="flex items-center">
          <Image
            src="/mampu-wordmark.webp"
            alt="MAMPU.IO"
            width={144}
            height={38}
            priority
            className="h-8 w-auto"
          />
        </Link>
        <ul className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <li>
            <Link
              href="/users"
              className="transition-colors hover:text-gray-900"
            >
              Users
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
