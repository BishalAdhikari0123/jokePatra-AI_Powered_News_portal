'use client';

import Link from 'next/link';
import { Newspaper, AlertCircle, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b-4 border-orange-500 bg-white sticky top-0 z-50 shadow-lg animate-slide-down">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-xl shadow-md transition-transform duration-300 hover:rotate-12">
              <Newspaper className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                jokePatra
              </h1>
              <p className="text-xs text-orange-600 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-pulse" />
                Nepal's AI-Powered Satire
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100 border-t border-orange-300 py-2.5 px-4">
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 text-orange-700 flex-shrink-0" />
          <p className="text-orange-900 font-medium text-center">
            <span className="font-extrabold">⚠️ Satirical Content:</span> All articles are AI-generated fiction for entertainment only!
          </p>
        </div>
      </div>
    </header>
  );
}
