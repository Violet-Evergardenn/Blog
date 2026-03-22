import { useState, useEffect } from 'react';

export function useImagePreloader(imageUrls: string[]) {
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function preloadImages() {
      const promises = imageUrls.map((url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = resolve; // Continue even if one fails
        });
      });

      await Promise.all(promises);

      if (!isCancelled) {
        setImagesPreloaded(true);
      }
    }

    if (imageUrls.length > 0) {
      preloadImages();
    } else {
      setImagesPreloaded(true);
    }

    return () => {
      isCancelled = true;
    };
  }, [imageUrls]);

  return imagesPreloaded;
}
