'use client';
import { useEffect, useState } from 'react';
import type { ChurchPhoto, GalleryDestination } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

// Module-level cache — persists for the browser session, survives component remounts.
const cache = new Map<string, ChurchPhoto[]>();

interface UseGalleryPhotosOptions {
  eventId?: number;
  sermonId?: number;
}

interface UseGalleryPhotosResult {
  photos: ChurchPhoto[];
  loading: boolean;
  error: string | null;
  primary: ChurchPhoto | null;
}

export default function useGalleryPhotos(
  destination: GalleryDestination,
  options: UseGalleryPhotosOptions = {}
): UseGalleryPhotosResult {
  const { eventId, sermonId } = options;
  const cacheKey = `${destination}|${eventId ?? ''}|${sermonId ?? ''}`;

  const [photos, setPhotos] = useState<ChurchPhoto[]>(cache.get(cacheKey) ?? []);
  const [loading, setLoading] = useState(!cache.has(cacheKey));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache.has(cacheKey)) {
      setPhotos(cache.get(cacheKey) ?? []);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    let url = `${API_URL}/gallery/?destination=${destination}`;
    if (eventId) url += `&event_id=${eventId}`;
    if (sermonId) url += `&sermon_id=${sermonId}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load gallery photos');
        return res.json();
      })
      .then((data) => {
        const result: ChurchPhoto[] = Array.isArray(data) ? data : (data.results ?? []);
        if (result.length > 0) cache.set(cacheKey, result);
        if (!cancelled) {
          setPhotos(result);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, destination, eventId, sermonId]);

  return { photos, loading, error, primary: photos[0] ?? null };
}
