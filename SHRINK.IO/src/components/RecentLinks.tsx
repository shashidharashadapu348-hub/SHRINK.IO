import { Copy, Check, ExternalLink, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export interface RecentLink {
  shortCode: string;
  originalUrl: string;
  createdAt: string;
}

interface RecentLinksProps {
  links: RecentLink[];
}

export function RecentLinks({ links }: RecentLinksProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (links.length === 0) return null;

  const handleCopy = async (shortCode: string) => {
    const url = `${window.location.origin}/r/${shortCode}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(shortCode);
    toast.success("Copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold font-display">Your Recent Links:</h3>
      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.shortCode}
            className="glass-card rounded-xl p-4 flex items-center justify-between gap-4 animate-fade-in"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold gradient-text truncate">
                shrink.io/{link.shortCode}
              </p>
              <p className="text-xs text-muted-foreground truncate">{link.originalUrl}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="secondary" className="gap-1.5" asChild>
                <a href={`${window.location.origin}/r/${link.shortCode}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Visit URL
                </a>
              </Button>
              <Button size="sm" variant="secondary" className="gap-1.5" asChild>
                <Link to={`/stats/${link.shortCode}`}>
                  <BarChart3 className="h-3.5 w-3.5" />
                  Stats
                </Link>
              </Button>
              <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => handleCopy(link.shortCode)}>
                {copiedId === link.shortCode ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                Copy
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
