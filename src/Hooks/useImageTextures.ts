import { useEffect, useState, useRef } from 'react';
import { Texture, TextureLoader, SRGBColorSpace } from 'three';

interface UseImageTexturesParams {
  /** Array of image URLs to load */
  urls: string[];
}

interface UseImageTexturesReturn {
  /** Array of loaded textures (null if loading failed) */
  textures: (Texture | null)[];
  /** Whether all textures have been loaded */
  loaded: boolean;
}

/**
 * Loads an array of image URLs as Three.js textures.
 * @param params - Object containing the image URLs
 * @returns Loaded textures array and loading state
 */
export function useImageTextures({ urls }: UseImageTexturesParams): UseImageTexturesReturn {
  const [textures, setTextures] = useState<(Texture | null)[]>([]);
  const [loaded, setLoaded] = useState(false);
  const loaderRef = useRef(new TextureLoader());
  const prevUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    const urlsChanged =
      urls.length !== prevUrlsRef.current.length ||
      urls.some((url, i) => url !== prevUrlsRef.current[i]);

    if (!urlsChanged) return;

    prevUrlsRef.current = urls;
    setLoaded(false);

    if (urls.length === 0) {
      setTextures([]);
      setLoaded(true);
      return;
    }

    let cancelled = false;

    Promise.all(
      urls.map(
        (url) =>
          new Promise<Texture | null>((resolve) => {
            loaderRef.current.load(
              url,
              (texture) => {
                texture.colorSpace = SRGBColorSpace;
                resolve(texture);
              },
              undefined,
              () => resolve(null),
            );
          }),
      ),
    ).then((results) => {
      if (cancelled) return;
      setTextures(results);
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [urls]);

  return { textures, loaded };
}
