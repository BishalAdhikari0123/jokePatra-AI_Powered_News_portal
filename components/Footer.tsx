import { Newspaper, Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t-4 border-orange-500 bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-xl shadow-lg">
                <Newspaper className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="font-extrabold text-2xl bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  jokePatra
                </p>
                <p className="text-sm text-gray-400">Nepal's AI Satire</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 text-center md:text-left">
              Where humor meets artificial intelligence in Nepal's most entertaining fake news outlet.
            </p>
          </div>

          {/* Tech */}
          <div className="text-center">
            <h3 className="font-bold text-lg mb-3 text-orange-400">Powered By</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Google Gemini 1.5 Flash</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Next.js & Supabase</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center md:text-right">
            <h3 className="font-bold text-lg mb-3 text-orange-400">Legal</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              All content is 100% fictional and AI-generated for satirical and entertainment purposes. 
              Any resemblance to real events is purely coincidental.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} jokePatra. All satire reserved.
            </p>
            <p className="text-sm text-gray-400 italic flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> and a lot of AI humor
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-orange-400 italic font-medium">
            ⚠️ Remember: This is satire. Don't take it seriously. Laugh responsibly! 😄
          </p>
        </div>
      </div>
    </footer>
  );
}
