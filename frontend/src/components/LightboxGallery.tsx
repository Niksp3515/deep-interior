import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl, getThumbnailUrl } from "@/lib/utils";

interface MediaItem {
  _id: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailKey?: string;
  caption?: string;
}

const getFileType = (url: string, dbType: string) => {
  if (!url) return dbType;
  const ext = url.split('.').pop()?.toLowerCase();
  
  if (['pdf', 'zip', 'skp', 'dwg', 'dxf'].includes(ext || '')) return 'document';
  if (['mp4', 'mov', 'webm', 'avi'].includes(ext || '')) return 'video';
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return 'image';

  return dbType;
};

interface LightboxGalleryProps {
  media: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function LightboxGallery({ media, initialIndex, onClose }: LightboxGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, media.length]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  if (media.length === 0) return null;

  const currentMedia = media[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors z-50"
        >
          <X className="w-6 h-6" />
        </button>

        {media.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-6 p-3 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors z-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-6 p-3 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors z-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div className="relative max-w-7xl max-h-[90vh] flex flex-col items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[85vh] flex items-center justify-center"
            >
               {getFileType(currentMedia.mediaUrl, currentMedia.mediaType) === "video" ? (
                <video
                  src={getImageUrl(currentMedia.mediaUrl)}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  poster={getThumbnailUrl(currentMedia.thumbnailKey)}
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl bg-black"
                />
              ) : getFileType(currentMedia.mediaUrl, currentMedia.mediaType) === "document" ? (
                <div className="w-[90vw] max-w-6xl h-[85vh] bg-card rounded-lg flex flex-col items-center justify-center shadow-2xl overflow-hidden relative">
                   <iframe 
                      src={`${getImageUrl(currentMedia.mediaUrl)}#toolbar=0&navpanes=0&scrollbar=1`}
                      className="w-full h-full border-0"
                      title={currentMedia.caption || "Protected Document"}
                      onContextMenu={(e) => e.preventDefault()}
                   />
                </div>
              ) : (
                <img
                  src={getImageUrl(currentMedia.mediaUrl)}
                  alt={currentMedia.caption || "Gallery image"}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                  onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
                />
              )}
            </motion.div>
          </AnimatePresence>
          
          {currentMedia.caption && (
            <div className="absolute bottom-[-40px] left-0 right-0 text-center">
              <p className="text-white/80 text-sm tracking-wide">{currentMedia.caption}</p>
            </div>
          )}
          
          <div className="absolute top-[-30px] left-0 right-0 text-center">
             <p className="text-white/40 text-xs tracking-widest">{currentIndex + 1} / {media.length}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
