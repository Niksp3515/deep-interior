import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

interface VideoThumbnailFallbackProps {
  src: string;
  className?: string;
  originalFileName?: string;
}

export default function VideoThumbnailFallback({ src, className, originalFileName }: VideoThumbnailFallbackProps) {
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src) return;

    const extractFrame = () => {
      try {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous'; // CRITICAL for R2 Proxy URLs
        video.muted = true;
        video.playsInline = true;
        video.autoplay = false;
        video.preload = 'metadata';
        
        video.onloadeddata = () => {
          // Seek to 1 second, or halfway if video is shorter
          video.currentTime = Math.min(1, video.duration / 2);
        };

        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setThumbnailDataUrl(dataUrl);
          }
        };

        video.onerror = () => {
          console.warn('Failed to dynamically extract fallback thumbnail for:', src);
          setError(true);
        };

        video.src = src;
      } catch (e) {
        console.error('Fallback canvas extraction failed:', e);
        setError(true);
      }
    };

    extractFrame();
  }, [src]);

  if (thumbnailDataUrl) {
    return (
      <img 
        src={thumbnailDataUrl} 
        alt="Generated Thumbnail" 
        className={className} 
        loading="lazy" 
      />
    );
  }

  // Pure CSS Skeleton while extracting
  return (
    <div className={`bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center p-4 relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse opacity-50" />
        <span className="text-[10px] text-zinc-500 w-full text-center truncate z-10 mx-6">
          {error ? (originalFileName || 'Video File') : 'Extracting frame...'}
        </span>
    </div>
  );
}
