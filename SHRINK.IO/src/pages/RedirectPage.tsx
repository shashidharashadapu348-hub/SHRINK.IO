import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { findLinkByShortCode, incrementClickCount, insertClick } from "@/lib/localDb";
import { Link2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const RedirectPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!shortCode) {
      setError(true);
      return;
    }

    const redirect = () => {
      // Look up the link
      const link = findLinkByShortCode(shortCode);

      if (!link) {
        setError(true);
        return;
      }

      // Track click and increment count
      insertClick(link.id, document.referrer || null, navigator.userAgent || null);
      incrementClickCount(link.id);

      // Redirect
      window.location.href = link.original_url;
    };

    redirect();
  }, [shortCode]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center space-y-6">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <h1 className="text-3xl font-bold font-display">Link not found</h1>
        <p className="text-muted-foreground">This short link doesn't exist or has been removed.</p>
        <Button asChild className="gap-2">
          <Link to="/">
            <Link2 className="h-4 w-4" />
            Back to shrink.io
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center space-y-4">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <p className="text-lg text-muted-foreground">Redirecting...</p>
      <p className="text-sm font-display gradient-text font-semibold">shrink.io</p>
    </div>
  );
};

export default RedirectPage;
