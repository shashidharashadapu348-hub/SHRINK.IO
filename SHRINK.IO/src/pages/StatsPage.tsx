import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { findLinkByShortCode, getClicksByLinkId } from "@/lib/localDb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link2, ArrowLeft, MousePointerClick, Calendar, Globe, Copy, Check } from "lucide-react";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface LinkData {
  id: string;
  original_url: string;
  short_code: string;
  click_count: number;
  created_at: string;
}

interface ClickData {
  clicked_at: string;
  referrer: string | null;
}

const StatsPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [link, setLink] = useState<LinkData | null>(null);
  const [clicks, setClicks] = useState<ClickData[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!shortCode) return;

    const fetchData = () => {
      const linkData = findLinkByShortCode(shortCode);

      if (!linkData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setLink(linkData);

      const clicksData = getClicksByLinkId(linkData.id).map((c) => ({
        clicked_at: c.clicked_at,
        referrer: c.referrer,
      }));

      setClicks(clicksData);
      setLoading(false);
    };

    fetchData();
  }, [shortCode]);

  const handleCopy = async () => {
    const url = `${window.location.origin}/r/${shortCode}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center space-y-6">
        <h1 className="text-3xl font-bold font-display">Stats not found</h1>
        <p className="text-muted-foreground">This link doesn't exist.</p>
        <Button asChild>
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  // Aggregate clicks by day
  const clicksByDay = clicks.reduce<Record<string, number>>((acc, click) => {
    const day = new Date(click.clicked_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(clicksByDay).map(([date, count]) => ({
    date,
    clicks: count,
  }));

  // Referrer breakdown
  const referrerCounts = clicks.reduce<Record<string, number>>((acc, click) => {
    const ref = click.referrer || "Direct";
    let domain = "Direct";
    if (ref !== "Direct") {
      try {
        domain = new URL(ref).hostname;
      } catch {
        domain = ref;
      }
    }
    acc[domain] = (acc[domain] || 0) + 1;
    return acc;
  }, {});

  const topReferrers = Object.entries(referrerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const chartConfig = {
    clicks: { label: "Clicks", color: "hsl(var(--primary))" },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <Link2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-display gradient-text">shrink.io</span>
          </Link>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 px-6 pb-12 max-w-4xl mx-auto w-full space-y-6">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : link ? (
          <>
            {/* Link Info */}
            <Card className="glass-card">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xl font-semibold font-display gradient-text break-all">
                      {window.location.origin}/r/{link.short_code}
                    </p>
                    <p className="text-sm text-muted-foreground truncate mt-1">{link.original_url}</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={handleCopy} className="gap-2 shrink-0">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MousePointerClick className="h-4 w-4" />
                    {link.click_count} clicks
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(link.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Clicks Chart */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-display">Clicks Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-64 w-full">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="clicks" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-12">No clicks yet</p>
                )}
              </CardContent>
            </Card>

            {/* Referrer Breakdown */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Top Referrers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topReferrers.length > 0 ? (
                  <div className="space-y-3">
                    {topReferrers.map(([domain, count]) => (
                      <div key={domain} className="flex items-center justify-between">
                        <span className="text-sm truncate">{domain}</span>
                        <span className="text-sm font-medium text-primary">{count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-6">No referrer data yet</p>
                )}
              </CardContent>
            </Card>
          </>
        ) : null}
      </main>

      <Footer />
    </div>
  );
};

export default StatsPage;
