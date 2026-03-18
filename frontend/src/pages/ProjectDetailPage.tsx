import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectById } from "@/lib/api";
import { ArrowLeft, MapPin, Calendar, Layers, Camera, Loader2, Maximize2, Play, FileText, Download } from "lucide-react";
import { useState } from "react";
import { getImageUrl, getThumbnailUrl } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import LightboxGallery from "@/components/LightboxGallery";
import SEO from "@/components/SEO";
import VideoThumbnailFallback from "@/components/VideoThumbnailFallback";

const getFileType = (url: string, dbType: string) => {
  if (!url) return dbType;
  const ext = url.split('.').pop()?.toLowerCase();
  
  if (['pdf', 'zip', 'skp', 'dwg', 'dxf'].includes(ext || '')) return 'document';
  if (['mp4', 'mov', 'webm', 'avi'].includes(ext || '')) return 'video';
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return 'image';

  return dbType;
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id!),
    enabled: !!id,
  });

  const [activeCategory, setActiveCategory] = useState(0);
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; media: any[]; startIndex: number }>({
    isOpen: false,
    media: [],
    startIndex: 0
  });

  if (isLoading) {
    return (
      <main className="pt-20 pb-32">
        <Skeleton className="w-full h-[60vh] rounded-none" />
        <div className="container mx-auto px-6 mt-12">
          <Skeleton className="h-4 w-full max-w-2xl mb-4" />
          <Skeleton className="h-4 w-5/6 max-w-2xl mb-4" />
          <Skeleton className="h-4 w-4/6 max-w-2xl" />
          
          <div className="mt-16">
            <Skeleton className="h-4 w-32 mb-6" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="pt-32 pb-24 text-center">
        <p className="text-muted-foreground">Project not found or error loading data.</p>
        <Link to="/portfolio" className="text-sm text-primary mt-4 inline-block">
          ← Back to Portfolio
        </Link>
      </main>
    );
  }

  const currentCategory = project.categories?.[activeCategory];
  const renders = currentCategory?.media?.filter((m: any) => m.mediaStage === "3d_design") || [];
  const realPhotos = currentCategory?.media?.filter((m: any) => m.mediaStage === "real_project") || [];

  return (
    <main className="pt-20 pb-32">
      <SEO 
        title={`${project.title} in ${project.location} | Deep Interior`}
        description={project.description || `View the luxury ${project.title} interior design project completed by Deep Interior in ${project.location}.`}
        keywords={`${project.title}, ${project.location} interior design, luxury home interiors, interior architecture, project portfolio`}
        image={getImageUrl(project.coverImage)}
        url={`https://deepinterior.com/project/${project._id}`}
        schema={JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": project.title,
          "image": getImageUrl(project.coverImage),
          "author": {
            "@type": "Organization",
            "name": "Deep Interior"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Deep Interior"
          },
          "description": project.description || `Luxury interior design project in ${project.location}`
        })}
      />
      
      {/* Hero Cover */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={getImageUrl(project.coverImage)}
          alt={project.title}
          onError={(e) => { e.currentTarget.style.display = "none" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto px-6 pb-12">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-brand mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Portfolio
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
            >
              <h1 className="font-display text-5xl md:text-7xl tracking-display text-foreground leading-[0.95]">
                {project.title}
              </h1>
              <div className="flex items-center gap-6 mt-4">
                <span className="flex items-center gap-2 text-sm text-foreground/70">
                  <MapPin className="w-4 h-4" /> {project.location}
                </span>
                <span className="flex items-center gap-2 text-sm text-foreground/70">
                  <Calendar className="w-4 h-4" /> {project.completionYear}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12">
        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-foreground/70 leading-relaxed max-w-2xl"
        >
          {project.description}
        </motion.p>

        {/* Category Tabs */}
        <div className="mt-16">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Room Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.categories?.map((cat: any, i: number) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(i)}
                className={`text-sm px-5 py-2.5 rounded-xl transition-brand ${
                  activeCategory === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        </div>

        {/* Category Content */}
        {currentCategory && (
          <motion.div
            key={currentCategory._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
            className="mt-12 space-y-16"
          >
            {/* 3D Design Section */}
            {renders.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl tracking-display text-foreground">
                      3D Design
                    </h3>
                    <p className="text-xs text-muted-foreground">Before construction — concept renders</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {renders.map((media: any, idx: number) => {
                    const fileType = getFileType(media.mediaUrl, media.mediaType);
                    return (
                    <div 
                      key={media._id} 
                      className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted cursor-pointer bg-black"
                      onClick={() => setLightbox({ isOpen: true, media: renders, startIndex: idx })}
                    >
                      {/* Global Security Overlay trapping right clicks securely blocking physical highlighting */}
                      <div className="absolute inset-0 z-20" onContextMenu={(e) => e.preventDefault()} draggable={false} />
                      {fileType === "video" ? (
                        <>
                          {media.thumbnailKey ? (
                            <img src={getThumbnailUrl(media.thumbnailKey)} alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-80" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          ) : (
                            <img src="/placeholder.jpg" alt="Video placeholder" className="absolute inset-0 w-full h-full object-cover opacity-80" loading="lazy" />
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
                            <Layers className="w-3 h-3" /> Open Secure Viewer
                          </span>
                        </div>
                      ) : (
                        <img
                          src={getImageUrl(media.mediaUrl)}
                          alt={media.caption || "3D render"}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                          onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                        />
                      )}
                      
                      {/* Interaction overlays */}
                      {media.caption && fileType !== 'document' ? (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/60 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                          <p className="text-primary-foreground text-sm">{media.caption}</p>
                          <Maximize2 className="w-5 h-5 text-white/70" />
                        </div>
                      ) : fileType !== 'document' ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none">
                          <Maximize2 className="w-8 h-8 text-white" />
                        </div>
                      ) : null}
                      <div className="absolute top-4 left-4">
                        <span className="text-[10px] uppercase tracking-widest bg-accent/90 text-accent-foreground px-3 py-1 rounded-full">
                          3D Render
                        </span>
                      </div>
                    </div>
                  )})}
                </div>
              </section>
            )}

            {/* Real Project Section */}
            {realPhotos.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl tracking-display text-foreground">
                      Real Project
                    </h3>
                    <p className="text-xs text-muted-foreground">After completion — final photography</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {realPhotos.map((media: any, idx: number) => {
                    const fileType = getFileType(media.mediaUrl, media.mediaType);
                    return (
                    <div 
                      key={media._id} 
                      className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted cursor-pointer bg-black"
                      onClick={() => setLightbox({ isOpen: true, media: realPhotos, startIndex: idx })}
                    >
                      {/* Global Security Overlay trapping right clicks securely blocking physical highlighting */}
                      <div className="absolute inset-0 z-20" onContextMenu={(e) => e.preventDefault()} draggable={false} />
                      {fileType === "video" ? (
                        <>
                          {media.thumbnailKey ? (
                            <img src={getThumbnailUrl(media.thumbnailKey)} alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-80" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
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
                            <Layers className="w-3 h-3" /> Open Secure Viewer
                          </span>
                        </div>
                      ) : (
                        <img
                          src={getImageUrl(media.mediaUrl)}
                          alt={media.caption || "Completed project"}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                          onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                        />
                      )}
                      
                      {/* Interaction overlays */}
                      {media.caption && fileType !== 'document' ? (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/60 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                          <p className="text-primary-foreground text-sm">{media.caption}</p>
                          <Maximize2 className="w-5 h-5 text-white/70" />
                        </div>
                      ) : fileType !== 'document' ? (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none">
                          <Maximize2 className="w-8 h-8 text-white" />
                        </div>
                      ) : null}
                      <div className="absolute top-4 left-4">
                        <span className="text-[10px] uppercase tracking-widest bg-primary/90 text-primary-foreground px-3 py-1 rounded-full">
                          Completed
                        </span>
                      </div>
                    </div>
                  )})}
                </div>
              </section>
            )}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 text-center"
        >
          <h2 className="font-display text-3xl md:text-5xl tracking-display text-foreground">
            Inspired by this project?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Let's discuss how we can create something equally remarkable for your space.
          </p>
          <Link
            to="/contact"
            className="inline-block mt-8 px-10 py-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-brand hover:scale-[0.98]"
          >
            Get in Touch
          </Link>
        </motion.div>
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
