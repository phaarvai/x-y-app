"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import XiyLogo from "@/components/XiyLogo";
import { useAuth, useAuthContext } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "@/lib/api-url";

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { token, logout } = useAuthContext();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await fetch(apiUrl("/api/auth/logout"), {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {}
    logout();
    queryClient.clear();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/"><XiyLogo /></Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" role="navigation">
            <Link href="/#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</Link>
            <Link href="/for-business" className="text-gray-600 hover:text-gray-900 transition-colors">For Business</Link>
            <Link href="/ai-assistant" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-300 text-violet-600 hover:bg-violet-50 transition-colors text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5" /> AI Assistant
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">Hi, {user?.name?.split(" ")[0]}</span>
                <Button variant="ghost" size="sm" className="text-gray-700" onClick={handleLogout}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link href="/login"><Button variant="ghost" size="sm" className="text-gray-700 font-medium">Sign In</Button></Link>
                <Link href="/register"><Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 rounded-lg">Get Started</Button></Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
