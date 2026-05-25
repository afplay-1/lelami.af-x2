/**
 * Helper to compress or downscale images on the client-side.
 * This ensures base64 data URLs remain small and fit within LocalStorage quotas.
 */
export function compressImage(
  fileOrDataUrl: File | string,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const processImageSrc = (src: string) => {
      // If it's not a browser environment or canvas is unsupported, fallback to original
      if (typeof window === 'undefined' || !window.document || !window.HTMLCanvasElement) {
        resolve(src);
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while sizing down
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        try {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (e) {
          // If security error like Tainted Canvas occurs, fallback to source
          resolve(src);
        }
      };

      img.onerror = () => {
        // Fallback to source on image loading error
        resolve(src);
      };

      img.src = src;
    };

    if (fileOrDataUrl instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          processImageSrc(e.target.result);
        } else {
          resolve('');
        }
      };
      reader.onerror = () => {
        resolve('');
      };
      reader.readAsDataURL(fileOrDataUrl);
    } else {
      processImageSrc(fileOrDataUrl);
    }
  });
}
