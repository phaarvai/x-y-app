import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Mic, Globe, Shield, Zap, Users, ArrowRight, ChevronRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetSearchSuggestions, useListLanguages, getGetSearchSuggestionsQueryKey } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";

const FEATURES = [
  { icon: <Globe className="w-6 h-6" />, title: "12+ Languages", desc: "Search in your native language including Arabic, Hindi, Swahili, and more. Full RTL support." },
  { icon: <Mic className="w-6 h-6" />, title: "Voice Search", desc: "Speak your question naturally. Powered by your browser's built-in speech recognition engine." },
  { icon: <Shield className="w-6 h-6" />, title: "Accessible by Design", desc: "Built for everyone — large touch targets, screen reader support, high contrast, and icon labels." },
  { icon: <Zap className="w-6 h-6" />, title: "AI-Powered", desc: "Get instant, contextual answers from our AI assistant alongside curated search results." },
];

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const { language } = useLanguage();

  const { data: suggestions } = useGetSearchSuggestions(
    { lang: language },
    { query: { queryKey: getGetSearchSuggestionsQueryKey({ lang: language }) } }
  );

  const { data: languagesData } = useListLanguages();
  const displayLanguages = languagesData?.languages?.slice(0, 8) || [];

  const handleSearch = (q: string) => {
    const searchQuery = q.trim();
    if (!searchQuery) return;
    setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b border-border">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Assistant
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-6">
            Ask anything,{" "}
            <span className="text-primary">in any language</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            AssistAI understands your question and provides clear, helpful answers. Use voice or text — our AI is here to help everyone.
          </p>

          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto" role="search" aria-label="Search form">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden />
                <Input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Ask me anything..."
                  className="pl-12 pr-4 h-14 text-base rounded-xl border-2 border-border focus:border-primary shadow-sm"
                  aria-label="Search input"
                  data-testid="input-search-hero"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-14 px-6 rounded-xl gap-2 shadow-md"
                aria-label="Search"
                data-testid="button-search-hero"
              >
                Search
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {suggestions?.suggestions && suggestions.suggestions.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 justify-center" aria-label="Suggested searches">
              <span className="text-sm text-muted-foreground self-center">Try:</span>
              {suggestions.suggestions.slice(0, 4).map(s => (
                <button
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="text-sm px-3 py-1.5 rounded-full bg-card border border-border hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  aria-label={`Search for: ${s}`}
                  data-testid={`button-suggestion-${s.substring(0, 10)}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Languages strip */}
      <section className="bg-card border-b border-border py-6" aria-label="Supported languages">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap flex items-center gap-1.5">
              <Globe className="w-4 h-4" /> Languages:
            </span>
            {displayLanguages.map(lang => (
              <span
                key={lang.code}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm font-medium whitespace-nowrap text-foreground"
                aria-label={`${lang.name} (${lang.nativeName})`}
              >
                <span role="img" aria-label={lang.name}>{lang.flag}</span>
                <span className="hidden sm:inline">{lang.nativeName}</span>
                <span className="sm:hidden">{lang.code.toUpperCase()}</span>
              </span>
            ))}
            {displayLanguages.length > 0 && (
              <span className="text-sm text-muted-foreground whitespace-nowrap">+ more</span>
            )}
          </div>
        </div>
      </section>

      {/* Trending */}
      {suggestions?.trending && suggestions.trending.length > 0 && (
        <section className="py-12 bg-background" aria-label="Trending searches">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" />
              Trending Topics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {suggestions.trending.map(t => (
                <button
                  key={t}
                  onClick={() => handleSearch(t)}
                  className="group flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-border hover:border-primary hover:shadow-sm transition-all text-left"
                  aria-label={`Explore trending topic: ${t}`}
                  data-testid={`button-trending-${t.substring(0, 10)}`}
                >
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{t}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 bg-muted/30" aria-label="Features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Built for everyone</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Designed with accessibility and inclusion at the core</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-background" aria-label="How it works">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-3">How it works</h2>
          <p className="text-muted-foreground text-lg mb-12">Three simple steps to get an answer</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Ask your question", desc: "Type or speak your question in any supported language" },
              { step: "2", title: "AI processes it", desc: "Our AI understands context and searches for relevant information" },
              { step: "3", title: "Get a clear answer", desc: "Receive a detailed AI response plus supporting resources" },
            ].map(s => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4 shadow-md">
                  {s.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
          <Button
            size="lg"
            className="mt-12 gap-2 px-8"
            onClick={() => setLocation("/search")}
            data-testid="button-try-now"
            aria-label="Try AssistAI now"
          >
            Try it now
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* For everyone CTA */}
      <section className="py-16 bg-primary text-primary-foreground" aria-label="Call to action">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Designed for every user</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Whether you are a student, a farmer, a professional, or someone with limited literacy — AssistAI is built to serve you with dignity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="gap-2" onClick={() => setLocation("/register")}>
              <UserPlus className="w-4 h-4" />
              Create free account
            </Button>
            <Button variant="outline" size="lg" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setLocation("/search")}>
              <Search className="w-4 h-4" />
              Search without account
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
