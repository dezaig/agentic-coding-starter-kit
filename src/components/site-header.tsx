import Link from "next/link";
import { UserProfile } from "@/components/auth/user-profile";
import { ModeToggle } from "./ui/mode-toggle";
import { CheckSquare } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link
            href="/"
            className="flex items-center gap-3 text-primary hover:text-primary/80 transition-all duration-200 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-200">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-bold">
              TaskFlow
            </span>
          </Link>
        </h1>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link 
              href="/pricing" 
              className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-colors font-medium"
            >
              Pricing
            </Link>
          </nav>
          <UserProfile />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
