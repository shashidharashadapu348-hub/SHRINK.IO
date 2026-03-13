
-- Create links table
CREATE TABLE public.links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code TEXT NOT NULL UNIQUE,
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clicks table for detailed analytics
CREATE TABLE public.clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  referrer TEXT,
  user_agent TEXT
);

-- Create index on short_code for fast lookups
CREATE INDEX idx_links_short_code ON public.links(short_code);

-- Create index on link_id for analytics queries
CREATE INDEX idx_clicks_link_id ON public.clicks(link_id);

-- Enable RLS
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;

-- Public read access to links (anonymous shortener)
CREATE POLICY "Anyone can read links"
  ON public.links FOR SELECT
  USING (true);

-- Public insert for links (via edge function, but also direct)
CREATE POLICY "Anyone can insert links"
  ON public.links FOR INSERT
  WITH CHECK (true);

-- Public update for click count increments
CREATE POLICY "Anyone can update click count"
  ON public.links FOR UPDATE
  USING (true);

-- Public read access to clicks for analytics
CREATE POLICY "Anyone can read clicks"
  ON public.clicks FOR SELECT
  USING (true);

-- Public insert for click tracking
CREATE POLICY "Anyone can insert clicks"
  ON public.clicks FOR INSERT
  WITH CHECK (true);
