// Local storage-based database for offline/fallback operation
// Mimics the Supabase data layer so the app works without a remote backend

const LINKS_KEY = "shrinkio_db_links";
const CLICKS_KEY = "shrinkio_db_clicks";

export interface DbLink {
  id: string;
  original_url: string;
  short_code: string;
  click_count: number;
  created_at: string;
}

export interface DbClick {
  id: string;
  link_id: string;
  clicked_at: string;
  referrer: string | null;
  user_agent: string | null;
}

function getLinks(): DbLink[] {
  try {
    return JSON.parse(localStorage.getItem(LINKS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLinks(links: DbLink[]) {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

function getClicks(): DbClick[] {
  try {
    return JSON.parse(localStorage.getItem(CLICKS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveClicks(clicks: DbClick[]) {
  localStorage.setItem(CLICKS_KEY, JSON.stringify(clicks));
}

function generateId(): string {
  return crypto.randomUUID();
}

// --- Links operations ---

export function findLinkByShortCode(shortCode: string): DbLink | null {
  return getLinks().find((l) => l.short_code === shortCode) || null;
}

export function insertLink(originalUrl: string, shortCode: string): DbLink {
  const links = getLinks();
  const newLink: DbLink = {
    id: generateId(),
    original_url: originalUrl,
    short_code: shortCode,
    click_count: 0,
    created_at: new Date().toISOString(),
  };
  links.push(newLink);
  saveLinks(links);
  return newLink;
}

export function incrementClickCount(linkId: string): void {
  const links = getLinks();
  const link = links.find((l) => l.id === linkId);
  if (link) {
    link.click_count += 1;
    saveLinks(links);
  }
}

export function getLinkById(linkId: string): DbLink | null {
  return getLinks().find((l) => l.id === linkId) || null;
}

// --- Clicks operations ---

export function insertClick(linkId: string, referrer: string | null, userAgent: string | null): DbClick {
  const clicks = getClicks();
  const newClick: DbClick = {
    id: generateId(),
    link_id: linkId,
    clicked_at: new Date().toISOString(),
    referrer,
    user_agent: userAgent,
  };
  clicks.push(newClick);
  saveClicks(clicks);
  return newClick;
}

export function getClicksByLinkId(linkId: string): DbClick[] {
  return getClicks()
    .filter((c) => c.link_id === linkId)
    .sort((a, b) => new Date(a.clicked_at).getTime() - new Date(b.clicked_at).getTime());
}
