// ── YouTube URL helper ────────────────────────────────────────────────────────

export function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const pat of patterns) {
    const m = url.match(pat);
    if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0`;
  }
  return null;
}

// ── Spotify URL helper ────────────────────────────────────────────────────────
// Spotify share links (open.spotify.com/track|episode|album|show|playlist/ID) are
// web pages, not raw audio files — the native <audio> player can't play them.
// Spotify's embed iframe is the only supported way to play them on a third-party site.

export function getSpotifyEmbed(url: string): { embedUrl: string; tall: boolean } | null {
  const m = url.match(/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|episode|album|show|playlist)\/([a-zA-Z0-9]+)/);
  if (!m) return null;
  const [, type, id] = m;
  return {
    embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`,
    tall: type === 'album' || type === 'show' || type === 'playlist',
  };
}
