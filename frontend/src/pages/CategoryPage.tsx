import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCategoryMedia } from "@/lib/api";
import { ArrowLeft, Loader2, Maximize2, MapPin, Play, FileText, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import LightboxGallery from "@/components/LightboxGallery";
import SEO from "@/components/SEO";
import { getImageUrl, getThumbnailUrl } from "@/lib/utils";
import VideoThumbnailFallback from "@/components/VideoThumbnailFallback";

const getFileType = (url: string, dbType: string) => {
  if (!url) return dbType;
  const ext = url.split('.').pop()?.toLowerCase();
  
  if (['pdf', 'zip', 'skp', 'dwg', 'dxf'].includes(ext || '')) return 'document';
  if (['mp4', 'mov', 'webm', 'avi'].includes(ext || '')) return 'video';
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return 'image';

  return dbType;
};

export default function CategoryPage() {
  const { categoryName } = useParams();
  
  const { data: mediaItems, isLoading, error } = useQuery({
    queryKey: ['categoryMedia', categoryName],
    queryFn: () => fetchCategoryMedia(categoryName!),
    enabled: !!categoryName,
  });

  const [lightbox, setLightbox] = useState<{ isOpen: boolean; media: any[]; startIndex: number }>({
    isOpen: false,
    media: [],
    startIndex: 0
  });

  if (isLoading) {
    return (
      <main className="pt-32 pb-32">
        <div className="container mx-auto px-6">
          <Skeleton className="h-4 w-32 mb-8" />
          <Skeleton className="h-16 w-64 mb-2" />
          <Skeleton className="h-6 w-48 mb-16" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-32 pb-24 text-center">
        <p className="text-muted-foreground">Error loading category media.</p>
        <Link to="/" className="text-sm text-primary mt-4 inline-block">
          ← Back Home
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-32">
      <SEO 
        title={`Luxury ${categoryName} Interior Design in Ahmedabad & Gujarat | Deep Interior`}
        description={`Explore our luxury ${categoryName} interior design projects by Deep Interior, the best interior designer in Ahmedabad, Sola, Science City, and across Gujarat.`}
        keywords={`${categoryName} interior design Ahmedabad, modern ${categoryName} interiors, best ${categoryName} designer Gujarat, home renovation Ahmedabad`}
        url={`https://deepinterior.com/category/${categoryName}`}
      />
      <div className="container mx-auto px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-brand mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <motion.div
           initial={{ opacity: 0, y: 16 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl md:text-6xl tracking-display text-foreground capitalize mb-2">
            {categoryName}
          </h1>
          <p className="text-muted-foreground">
            {mediaItems?.length || 0} designs from all our locations
          </p>
        </motion.div>

        {mediaItems?.length === 0 ? (
          <div className="mt-16 text-center py-20 bg-muted/50 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground">No media available for this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
             {mediaItems.map((media: any, idx: number) => {
                const fileType = getFileType(media.mediaUrl, media.mediaType);
                return (
                <motion.div 
                  key={media._id} 
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted cursor-pointer bg-black"
                  onClick={() => setLightbox({ isOpen: true, media: mediaItems, startIndex: idx })}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                >
                  {/* Global Security Overlay trapping right clicks securely blocking physical highlighting */}
                  <div className="absolute inset-0 z-20" onContextMenu={(e) => e.preventDefault()} draggable={false} />
                    {fileType === "video" ? (
                      <>
                        {media.thumbnailKey ? (
                          <img src={getThumbnailUrl(media.thumbnailKey)} alt={media.caption || `${categoryName} video tour in Ahmedabad`} className="absolute inset-0 w-full h-full object-cover opacity-80" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                          <VideoThumbnailFallback src={getImageUrl(media.mediaUrl)} className="absolute inset-0 w-full h-full object-cover opacity-80" originalFileName={media.originalFileName} />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                          <Play className="w-12 h-12 text-white drop-shadow-lg ml-1 transition-transform duration-500 group-hover:scale-110" fill="currentColor" />
                        </div>
                      </>
                  ) : fileType === "document" ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-card border border-border">
                      <FileText className="w-12 h-12 text-muted-foreground mb-3 flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground text-center truncate w-full px-6" title={media.originalFileName || media.mediaUrl.split('/').pop()}>
                        {media.originalFileName || media.mediaUrl.split('/').pop()}
                      </span>
                      <span className="mt-2 text-xs text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3 h-3" /> Open Secure Viewer
                      </span>
                    </div>
                  ) : (
                      <img
                        src={getImageUrl(media.mediaUrl)}
                        alt={media.caption || `${categoryName} interior design in Ahmedabad, Gujarat`}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                      />
                  )}

                  {/* Top Left Project Info tag */}
                  {media.projectId && fileType !== 'document' && (
                     <div className="absolute top-4 left-4 max-w-[80%]">
                        <span className="inline-flex flex-col gap-0.5 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded text-xs shadow-sm">
                          <span className="font-medium truncate">{media.projectId.title}</span>
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <MapPin className="w-2.5 h-2.5" /> {media.projectId.location}
                          </span>
                        </span>
                     </div>
                  )}
                  
                  {/* Bottom Hover Interaction */}
                  {fileType !== 'document' && (
                    <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-400 ${!media.caption && "items-center justify-center p-0 inset-0 from-black/20"}`}>
                      {media.caption && <p className="text-primary-foreground text-sm font-medium pr-4">{media.caption}</p>}
                      <Maximize2 className={`w-6 h-6 ${media.caption ? "text-white/80" : "text-white w-10 h-10"}`} />
                    </div>
                  )}
                </motion.div>
              )})}
          </div>
        )}
      </div>

      {lightbox.isOpen && (
        <LightboxGallery
          media={lightbox.media}
          initialIndex={lightbox.startIndex}
          onClose={() => setLightbox({ ...lightbox, isOpen: false })}
        />
      )}
    </main>
  );
}
