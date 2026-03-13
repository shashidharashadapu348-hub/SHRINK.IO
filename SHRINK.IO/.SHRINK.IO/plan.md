

# Shrink.io — URL Shortener Web App

## Branding & Design
- **Dark mode by default** with vibrant purple (#7C3AED) as primary accent
- Logo: "shrink.io" in bold sans-serif with a purple gradient
- Tagline: "Make links shrink. Instantly."
- Premium feel with subtle gradients, shadows, smooth animations, and glassmorphism touches
- Fully responsive, mobile-first design

---

## Pages & Features

### 1. Homepage (/)
- **Hero section**: Large heading "Shrink your links. Share faster." with animated gradient text
- **URL input form**: Large input field + prominent purple "Shrink it!" button with loading state
- **Result card** (appears after shortening):
  - Displays the shortened URL
  - One-click Copy button with toast confirmation
  - Open link button
  - QR code for the shortened URL
- **Recent links section**: Shows last 5 shortened links (stored in browser localStorage) with copy buttons
- **Footer**: "Made with ❤️ for the internet" + shrink.io branding

### 2. Redirect Page (/r/:shortCode)
- Looks up the short code in Supabase
- Logs the click (timestamp, referrer, user agent) for analytics
- Redirects the user to the original URL via client-side redirect
- Shows a brief "Redirecting..." screen with branding

### 3. Not Found Page
- Friendly "Link not found" message with illustration
- Button to go back to homepage

### 4. Analytics Page (/stats/:shortCode)
- Accessible via a "Stats" link on the result card
- Shows: original URL, short URL, total clicks, creation date
- Click chart over time (using Recharts)
- Referrer breakdown (where clicks came from)
- No login required — anyone with the stats link can view it

---

## Backend (Supabase via Lovable Cloud)

### Database Tables
- **links**: id, original_url, short_code (unique), created_at, click_count
- **clicks**: id, link_id (FK), clicked_at, referrer, user_agent

### Edge Function
- **shorten**: Validates URL (must be http/https via Zod), generates a unique 7-character alphanumeric code (no vowels), stores in DB, returns short URL

### Logic
- Short codes: 7 chars from `bcdfghjklmnpqrstvwxyz0123456789` (no vowels to avoid bad words)
- Uniqueness check before saving
- Click tracking on each redirect

---

## Polish & UX
- Toast notifications via Sonner (copy success, errors)
- Smooth fade/scale animations on result card appearance
- Input validation with helpful error messages
- SEO meta tags (title: "Shrink.io — Free URL Shortener")
- Skeleton loading states
- Keyboard accessible (Enter to submit)

