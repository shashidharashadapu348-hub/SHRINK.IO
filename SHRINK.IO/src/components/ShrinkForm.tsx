import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, Loader2, Sparkles } from "lucide-react";
import { findLinkByShortCode, insertLink } from "@/lib/localDb";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const CHARS = "bcdfghjklmnpqrstvwxyz0123456789";

function generateShortCode(length = 7): string {
  let code = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    code += CHARS[array[i] % CHARS.length];
  }
  return code;
}

interface ShrinkFormProps {
  onShortened: (data: { id: string; original_url: string; short_code: string; created_at: string }) => void;
}

export function ShrinkForm({ onShortened }: ShrinkFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      toast.error("Please enter a URL");
      return;
    }

    // Validate URL
    try {
      const parsed = new URL(trimmed);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      toast.error("Invalid URL. Must start with http:// or https://");
      return;
    }

    setLoading(true);
    try {
      // Generate a unique short code with retry
      let shortCode: string = "";
      let attempts = 0;
      while (attempts < 10) {
        shortCode = generateShortCode();
        const existing = findLinkByShortCode(shortCode);
        if (!existing) break;
        attempts++;
      }

      if (attempts >= 10) {
        throw new Error("Failed to generate unique code. Please try again.");
      }

      const data = insertLink(trimmed, shortCode);

      onShortened(data);
      setUrl("");
      toast.success("Link shortened successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card glow-purple">
      <CardContent className="p-6 space-y-5">
        <h2 className="text-xl font-bold font-display flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          Shorten a Link
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <span>↗</span> Long URL
            </label>
            <Input
              type="text"
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 text-base bg-secondary/50 border-border/50 focus-visible:ring-primary/50 rounded-lg"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base glow-purple transition-all duration-300 hover:scale-[1.01]"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Shrink it!
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
