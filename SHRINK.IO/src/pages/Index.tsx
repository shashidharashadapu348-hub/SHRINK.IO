import { useState, useEffect } from "react";
import { ShrinkForm } from "@/components/ShrinkForm";
import { ShortUrlCard } from "@/components/ShortUrlCard";
import { RecentLinks, type RecentLink } from "@/components/RecentLinks";
import { Footer } from "@/components/Footer";
import { Link2 } from "lucide-react";

const STORAGE_KEY = "shrinkio_recent_links";

function getRecentLinks(): RecentLink[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentLink(link: RecentLink) {
  const existing = getRecentLinks().filter((l) => l.shortCode !== link.shortCode);
  const updated = [link, ...existing].slice(0, 5);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

const Index = () => {
  const [result, setResult] = useState<{ shortCode: string; originalUrl: string } | null>(null);
  const [recentLinks, setRecentLinks] = useState<RecentLink[]>([]);

  useEffect(() => {
    setRecentLinks(getRecentLinks());
  }, []);

  const handleShortened = (data: { short_code: string; original_url: string; created_at: string }) => {
    setResult({ shortCode: data.short_code, originalUrl: data.original_url });
    const updated = saveRecentLink({
      shortCode: data.short_code,
      originalUrl: data.original_url,
      createdAt: data.created_at,
    });
    setRecentLinks(updated);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 border-b border-border/40">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Link2 className="h-7 w-7 text-primary" />
            <span className="text-2xl font-bold font-display gradient-text">shrink.io</span>
          </div>
        </div>
      </header>

      {/* Hero + Form two-column layout */}
      <main className="flex-1 px-6 py-12 md:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Hero text */}
          <div className="space-y-6 pt-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-tight">
              URL Shortener, Branded{" "}
              <span className="gradient-text">Short Links</span>{" "}
              & Analytics
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Welcome to shrink.io — simplifying the Internet through the power of short URLs. Free, fast, and beautiful link shortening with detailed analytics.
            </p>
            <p className="text-muted-foreground max-w-lg">
              Track link analytics, generate QR codes, and enjoy powerful features — all for free.
            </p>
          </div>

          {/* Right: Shorten form card */}
          <div className="w-full">
            <ShrinkForm onShortened={handleShortened} />

            {result && (
              <div className="mt-6">
                <ShortUrlCard shortCode={result.shortCode} originalUrl={result.originalUrl} />
              </div>
            )}
          </div>
        </div>

        {/* Recent Links */}
        <div className="max-w-7xl mx-auto mt-16">
          <RecentLinks links={recentLinks} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
