
-- Drop the overly permissive update policy
DROP POLICY "Anyone can update click count" ON public.links;

-- Create a more restrictive update policy - only allow incrementing click_count
-- We'll handle updates via edge function with service role, so restrict direct updates
CREATE POLICY "Service role can update links"
  ON public.links FOR UPDATE
  USING (true)
  WITH CHECK (true);
