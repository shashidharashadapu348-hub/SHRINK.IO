import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-muted-foreground">
      <p className="flex items-center justify-center gap-1">
        Made with <Heart className="h-4 w-4 text-primary fill-primary" /> for the internet
      </p>
      <p className="mt-1 font-display font-semibold gradient-text text-base">shrink.io</p>
    </footer>
  );
}
