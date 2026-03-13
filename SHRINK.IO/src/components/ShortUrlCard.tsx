import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, BarChart3, Check, QrCode, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";

interface ShortUrlCardProps {
  shortCode: string;
  originalUrl: string;
}

export function ShortUrlCard({ shortCode, originalUrl }: ShortUrlCardProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const functionalUrl = `${window.location.origin}/r/${shortCode}`;
  const brandedUrl = `shrink.io/${shortCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(functionalUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="glass-card animate-scale-in">
      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" /> Shrink Link
          </label>
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-lg px-4 py-3">
            <p className="text-base font-semibold font-display gradient-text break-all flex-1">{brandedUrl}</p>
            <Button size="icon" variant="ghost" onClick={handleCopy} className="shrink-0">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground truncate">Original: {originalUrl}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="secondary" className="gap-1.5">
            <a href={functionalUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Visit URL
            </a>
          </Button>
          <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => setShowQR(!showQR)}>
            <QrCode className="h-3.5 w-3.5" />
            QR
          </Button>
          <Button onClick={handleCopy} size="sm" variant="secondary" className="gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            Copy
          </Button>
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <Link to={`/stats/${shortCode}`}>
              <BarChart3 className="h-3.5 w-3.5" />
              Stats
            </Link>
          </Button>
        </div>

        {showQR && (
          <div className="flex justify-center pt-2 animate-fade-in">
            <div className="bg-white p-4 rounded-xl">
              <QRCodeSVG value={functionalUrl} size={180} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
