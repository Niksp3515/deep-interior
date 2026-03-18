import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (path?: string) => {
  if (!path) return "";
  
  let cleanPath = path;
  // Rescue legacy uploads that got poisoned with hardcoded localhost domains
  if (cleanPath.startsWith("http://localhost:5000")) {
    cleanPath = cleanPath.replace("http://localhost:5000", "");
  } else if (cleanPath.startsWith("http")) {
    return cleanPath;
  }
  
  const apiUrl = import.meta.env.VITE_API_URL || '';
  return `${apiUrl.replace('/api', '')}${cleanPath}`;
};

export function getThumbnailUrl(key?: string) {
  if (!key) return undefined;
  const baseUrl = import.meta.env.VITE_API_URL || '/api';
  return `${baseUrl}/media/cover/${key}`;
}

export const generateVideoThumbnail = (file: File): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration / 2);
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          resolve(blob);
        }, 'image/jpeg', 0.8);
      } else {
        URL.revokeObjectURL(url);
        resolve(null);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
  });
};
