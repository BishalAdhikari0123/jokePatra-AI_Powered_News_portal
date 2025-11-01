'use client';

import Link from 'next/link';
import { Newspaper, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <Newspaper className="w-8 h-8 text-orange-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">jokePatra</h1>
              <p className="text-xs text-orange-600 font-semibold">
                Nepal's Satirical News
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>

      <div className="bg-orange-50 border-t border-orange-200 py-2 px-4">
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 text-orange-600" />
          <p className="text-orange-800 font-medium">
            <span className="font-bold">Disclaimer:</span> All news on jokePatra
            is fictional and satirical, created by AI for entertainment purposes
            only.
          </p>
        </div>
      </div>
    </header>
  );
}
