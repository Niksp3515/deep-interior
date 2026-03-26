import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjectById, updateProject, createCategory, deleteCategory, uploadMedia, deleteMedia, uploadCover } from "@/lib/api";
import { useState, useRef } from "react";
import { ArrowLeft, Plus, Trash2, Upload, Loader2, Image as ImageIcon, Film, Play, FileBox, FileArchive, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import LightboxGallery from "@/components/LightboxGallery";
import VideoThumbnailFallback from "@/components/VideoThumbnailFallback";
import { getImageUrl, generateVideoThumbnail, getThumbnailUrl } from "@/lib/utils";

const getFileType = (url: string, dbType: string) => {
  if (!url) return dbType;
  const ext = url.split('.').pop()?.toLowerCase();
  
  if (['pdf', 'zip', 'skp', 'dwg', 'dxf'].includes(ext || '')) return 'document';
  if (['mp4', 'mov', 'webm', 'avi'].includes(ext || '')) return 'video';
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return 'image';

  return dbType; // fallback if mapping isn't cleanly resolved
};

export default function AdminProjectEdit() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newCategoryName, setNewCategoryName] = useState("");
  const [uploadingStage, setUploadingStage] = useState<"3d_design" | "real_project" | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; media: any[]; startIndex: number }>({
    isOpen: false,
    media: [],
    startIndex: 0
  });

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id!),
    enabled: !!id
  });

  const catMutation = useMutation({
    mutationFn: (name: string) => createCategory(id!, { categoryName: name }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['project', id] });
      setNewCategoryName("");
      toast.success("Category added");
    }
  });

  const delCatMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast.success("Category deleted");
    }
  });

  const coverMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadCover(formData);
      return updateProject(id!, { coverImage: res.url });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast.success("Cover updated");
    }
  });

  const mediaMutation = useMutation({
    mutationFn: async ({ categoryId, fileArray, stage, thumbnails }: any) => {
      const formData = new FormData();
      formData.append('projectId', id!);
      formData.append('mediaStage', stage);
      
      fileArray.forEach((file: any, index: number) => {
        formData.append('media', file);
        if (thumbnails && thumbnails[index]) {
          formData.append(`thumbnail_${index}`, thumbnails[index], `thumb_${index}.jpg`);
        }
      });
      
      return uploadMedia(categoryId, formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast.success("Media uploaded successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  });

  const delMediaMutation = useMutation({
    mutationFn: deleteMedia,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast.success("Media deleted");
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeCategoryId || !uploadingStage) return;
    
    // Copy the files to a plain array immediately because we are about to clear the input
    const fileArray = Array.from(files);
    
    // Explicit File Size Validation
    for (const file of fileArray) {
      if (file.type.startsWith('image/') && file.size > 500 * 1024) {
        toast.error(`Image "${file.name}" exceeds 500KB limit.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      if (file.type.startsWith('video/') && file.size > 100 * 1024 * 1024) {
        toast.error(`Video "${file.name}" exceeds 100MB limit.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }

    toast.info(`Preparing ${fileArray.length} file(s)...`);

    // Process thumbnails for any videos
    const thumbnails: (Blob | null)[] = [];
    for (const file of fileArray) {
      if (file.type.startsWith('video/')) {
        try {
           const blob = await generateVideoThumbnail(file);
           thumbnails.push(blob);
        } catch(err) {
           console.error("Failed to extract thumbnail", err);
           thumbnails.push(null);
        }
      } else {
        thumbnails.push(null);
      }
    }

    toast.info(`Uploading ${fileArray.length} file(s)...`);
    mediaMutation.mutate({ categoryId: activeCategoryId, fileArray, stage: uploadingStage, thumbnails });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerUpload = (categoryId: string, stage: "3d_design" | "real_project") => {
    setActiveCategoryId(categoryId);
    setUploadingStage(stage);
    fileInputRef.current?.click();
  };

  if (isLoading || !project) {
    return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div>
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,video/*,.pdf,.zip,.dwg,.dxf,.skp" multiple />
      
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Col: Project Details & Cover */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-card border rounded-2xl p-6">
            <h3 className="text-xl font-display mb-4">Project Info</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{project.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cover Image</p>
                <div className="mt-2 relative aspect-[4/3] rounded-lg overflow-hidden bg-muted group">
                  {project.coverImage ? (
                    <img src={getImageUrl(project.coverImage)} alt="Cover" onError={(e) => { e.currentTarget.style.display = "none" }} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">No Cover</div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm flex items-center gap-2">
                      <Upload className="w-4 h-4"/> {coverMutation.isPending ? "Uploading..." : "Change Cover"}
                      <input type="file" className="hidden" accept="image/*" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 500 * 1024) {
                            toast.error("Cover image exceeds 500KB limit.");
                            e.target.value = '';
                            return;
                          }
                          coverMutation.mutate(file);
                        }
                      }} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Categories & Media */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="bg-card border rounded-2xl p-6">
            <h3 className="text-xl font-display mb-6">Categories</h3>
            
            <form 
              onSubmit={e => { e.preventDefault(); catMutation.mutate(newCategoryName); }}
              className="flex gap-2 mb-8"
            >
              <input 
                type="text" 
                placeholder="New Category (e.g., Living Room)" 
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                className="flex-1 p-2 rounded-lg border bg-background"
                required
              />
              <button type="submit" disabled={catMutation.isPending} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-8">
              {project.categories?.map((cat: any) => (
                <div key={cat._id} className="border rounded-xl p-4 bg-background">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b">
                    <h4 className="font-medium text-lg">{cat.categoryName}</h4>
                    <button 
                      onClick={() => { if(confirm("Delete category and all its media?")) delCatMutation.mutate(cat._id); }}
                      className="p-1.5 text-destructive rounded-md hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 3D Renders Row */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2"><ImageIcon className="w-4 h-4"/> 3D Designs</p>
                      <button 
                        onClick={() => triggerUpload(cat._id, "3d_design")} 
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                        disabled={mediaMutation.isPending && uploadingStage === "3d_design"}
                      >
                        {mediaMutation.isPending && uploadingStage === "3d_design" && activeCategoryId === cat._id ? (
                          <><Loader2 className="w-3 h-3 animate-spin"/> Uploading...</>
                        ) : (
                          "+ Upload 3D"
                        )}
                      </button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                       {cat.media?.filter((m: any) => m.mediaStage === "3d_design").map((m: any, idx: number) => {
                         const fileType = getFileType(m.mediaUrl, m.mediaType);
                         return (
                          <div key={m._id} className="relative w-32 h-24 rounded-lg bg-muted flex-shrink-0 group overflow-hidden cursor-pointer border bg-black" onClick={() => setLightbox({ isOpen: true, media: cat.media.filter((i: any) => i.mediaStage === "3d_design"), startIndex: idx })}>
                             {/* Global Security Overlay trapping right clicks securely blocking physical highlighting */}
                             <div className="absolute inset-0 z-[20]" onContextMenu={(e) => e.preventDefault()} draggable={false} />
                             {fileType === 'video' ? (
                              <>
                                {m.thumbnailKey ? (
                                  <img src={getThumbnailUrl(m.thumbnailKey)} alt="Video thumbnail" className="w-full h-full object-cover select-none" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                ) : (
                                  <VideoThumbnailFallback src={getImageUrl(m.mediaUrl)} className="w-full h-full object-cover select-none" originalFileName={m.originalFileName} />
                                )}
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                                  <Play className="w-8 h-8 text-white opacity-80 ml-1" fill="currentColor" />
                                </div>
                              </>
                             ) : fileType === 'pdf' || fileType === 'document' ? (
                               <div 
                                  className="w-full h-full flex flex-col items-center justify-center bg-card"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                      const response = await fetch(getImageUrl(m.mediaUrl));
                                      const blob = await response.blob();
                                      const url = window.URL.createObjectURL(blob);
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = m.originalFileName || 'document.pdf';
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      window.URL.revokeObjectURL(url);
                                    } catch (err) {
                                      const link = document.createElement('a');
                                      link.href = getImageUrl(m.mediaUrl);
                                      link.download = m.originalFileName || 'document.pdf';
                                      link.target = '_blank';
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }
                                  }}
                               >
                                  <FileText className="w-8 h-8 text-muted-foreground mb-1 flex-shrink-0"/>
                                  <span className="text-[10px] font-medium text-muted-foreground text-center truncate w-full px-2" title={m.originalFileName || m.mediaUrl.split('/').pop()}>
                                    {m.originalFileName || (m.mediaUrl.split('/').pop())}
                                  </span>
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-10 text-white hover:text-primary transition-colors pointer-events-none">
                                     <Play className="w-6 h-6 mb-1" />
                                     <span className="text-[10px] text-center px-1">Download</span>
                                  </div>
                               </div>
                             ) : (
                              <img src={getImageUrl(m.mediaUrl)} alt="" className="w-full h-full object-cover select-none" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                             )}
                             <button onClick={(e) => { e.stopPropagation(); if(confirm("Delete media?")) delMediaMutation.mutate(m._id); }} className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md">
                              <Trash2 className="w-3 h-3" />
                             </button>
                          </div>
                        );
                      })}
                      {(!cat.media || cat.media.filter((m: any) => m.mediaStage === "3d_design").length === 0) && (
                        <p className="text-xs text-muted-foreground italic">No 3D designs uploaded yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Real Project Row */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Film className="w-4 h-4"/> Real Project Photos & Videos</p>
                      <button 
                        onClick={() => triggerUpload(cat._id, "real_project")} 
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                        disabled={mediaMutation.isPending && uploadingStage === "real_project"}
                      >
                         {mediaMutation.isPending && uploadingStage === "real_project" && activeCategoryId === cat._id ? (
                          <><Loader2 className="w-3 h-3 animate-spin"/> Uploading...</>
                        ) : (
                          "+ Upload Real Media"
                        )}
                      </button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                       {cat.media?.filter((m: any) => m.mediaStage === "real_project").map((m: any, idx: number) => {
                         const fileType = getFileType(m.mediaUrl, m.mediaType);
                         return (
                          <div key={m._id} className="relative w-32 h-24 rounded-lg bg-muted flex-shrink-0 group overflow-hidden cursor-pointer border bg-black" onClick={() => setLightbox({ isOpen: true, media: cat.media.filter((i: any) => i.mediaStage === "real_project"), startIndex: idx })}>
                             {/* Global Security Overlay trapping right clicks securely blocking physical highlighting */}
                             <div className="absolute inset-0 z-[20]" onContextMenu={(e) => e.preventDefault()} draggable={false} />
                             {fileType === 'video' ? (
                              <>
                                {m.thumbnailKey ? (
                                  <img src={getThumbnailUrl(m.thumbnailKey)} alt="Video thumbnail" className="w-full h-full object-cover select-none" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                ) : (
                                  <VideoThumbnailFallback src={getImageUrl(m.mediaUrl)} className="w-full h-full object-cover select-none" originalFileName={m.originalFileName} />
                                )}
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                                  <Play className="w-8 h-8 text-white opacity-80 ml-1" fill="currentColor" />
                                </div>
                              </>
                             ) : fileType === 'pdf' || fileType === 'document' ? (
                               <div 
                                  className="w-full h-full flex flex-col items-center justify-center bg-card"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                      const response = await fetch(getImageUrl(m.mediaUrl));
                                      const blob = await response.blob();
                                      const url = window.URL.createObjectURL(blob);
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = m.originalFileName || 'document.pdf';
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      window.URL.revokeObjectURL(url);
                                    } catch (err) {
                                      const link = document.createElement('a');
                                      link.href = getImageUrl(m.mediaUrl);
                                      link.download = m.originalFileName || 'document.pdf';
                                      link.target = '_blank';
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }
                                  }}
                               >
                                  <FileText className="w-8 h-8 text-muted-foreground mb-1 flex-shrink-0"/>
                                  <span className="text-[10px] font-medium text-muted-foreground text-center truncate w-full px-2" title={m.originalFileName || m.mediaUrl.split('/').pop()}>
                                    {m.originalFileName || (m.mediaUrl.split('/').pop())}
                                  </span>
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-10 text-white hover:text-primary transition-colors pointer-events-none">
                                     <Play className="w-6 h-6 mb-1" />
                                     <span className="text-[10px] text-center px-1">Download</span>
                                  </div>
                               </div>
                             ) : (
                              <img src={getImageUrl(m.mediaUrl)} alt="" className="w-full h-full object-cover select-none" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                             )}
                             <button onClick={(e) => { e.stopPropagation(); if(confirm("Delete media?")) delMediaMutation.mutate(m._id); }} className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md">
                              <Trash2 className="w-3 h-3" />
                             </button>
                          </div>
                        );
                      })}
                      {(!cat.media || cat.media.filter((m: any) => m.mediaStage === "real_project").length === 0) && (
                        <p className="text-xs text-muted-foreground italic">No real photos uploaded yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(!project.categories || project.categories.length === 0) && (
                <p className="text-center py-8 text-muted-foreground">No categories added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {lightbox.isOpen && (
        <LightboxGallery
          media={lightbox.media}
          initialIndex={lightbox.startIndex}
          onClose={() => setLightbox({ ...lightbox, isOpen: false })}
        />
      )}
    </div>
  );
}
