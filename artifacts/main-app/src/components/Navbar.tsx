import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Search, History, User, LogIn, UserPlus, LogOut, Menu, X, Moon, Sun, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useAuthContext } from "@/hooks/use-auth";
import { useLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Navbar() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const { user, isAuthenticated } = useAuth();
  const { logout } = useAuthContext();
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        logout();
        queryClient.clear();
      }
    });
    setMenuOpen(false);
  };

  const isActive = (path: string) =>
    location === path ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground";

  const navLinks = [
    { href: "/", label: "Home", icon: <Bot className="w-4 h-4" /> },
    { href: "/search", label: "Search", icon: <Search className="w-4 h-4" /> },
    ...(isAuthenticated ? [{ href: "/history", label: "History", icon: <History className="w-4 h-4" /> }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="AssistAI Home">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">AssistAI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <span className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.href)}`}>
                  {link.icon}
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDark} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            {isAuthenticated ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="gap-2" data-testid="link-profile">
                    <User className="w-4 h-4" />
                    {user?.name?.split(" ")[0]}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2" data-testid="button-logout">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="gap-2" data-testid="link-login">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="gap-2" data-testid="link-register">
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle theme">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" data-testid="button-menu-toggle">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              <span className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive(link.href)}`}>
                {link.icon}
                {link.label}
              </span>
            </Link>
          ))}
          <div className="pt-2 border-t border-border mt-2">
            {isAuthenticated ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)}>
                  <span className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground">
                    <User className="w-4 h-4" /> Profile
                  </span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 w-full text-left">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-1.5"><LogIn className="w-4 h-4" />Sign In</Button>
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="flex-1">
                  <Button size="sm" className="w-full gap-1.5"><UserPlus className="w-4 h-4" />Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
