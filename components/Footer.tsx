import { Newspaper } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-orange-600" />
            <div>
              <p className="font-bold text-gray-900">jokePatra</p>
              <p className="text-xs text-gray-600">Nepal's Satirical News Platform</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600">
              Powered by Google Gemini 1.5 Flash
            </p>
            <p className="text-xs text-gray-500 mt-1">
              &copy; {new Date().getFullYear()} jokePatra. All satire is AI-generated.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 italic">
            Remember: This is satire. Don't take it seriously. Laugh responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}
