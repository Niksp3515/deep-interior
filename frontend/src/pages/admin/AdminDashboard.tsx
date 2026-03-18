import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjects, createProject, deleteProject } from "@/lib/api";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', location: '', description: '', completionYear: '' });

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjects(),
    staleTime: 1000 * 60 * 5, // 5 minute local cache to prevent redundant fetches
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsCreating(false);
      setNewProject({ title: '', location: '', description: '', completionYear: '' });
      toast.success("Project created");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to create project")
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success("Project deleted");
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newProject);
  };

  if (isLoading) {
    return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-display">Manage Projects</h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" /> {isCreating ? "Cancel" : "New Project"}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-8 p-6 border rounded-2xl bg-card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <input required type="text" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full p-2 border rounded-lg bg-background" />
            </div>
            <div>
              <label className="block text-sm mb-1">Location</label>
              <input required type="text" value={newProject.location} onChange={e => setNewProject({...newProject, location: e.target.value})} className="w-full p-2 border rounded-lg bg-background" />
            </div>
            <div>
              <label className="block text-sm mb-1">Completion Year</label>
              <input required type="text" value={newProject.completionYear} onChange={e => setNewProject({...newProject, completionYear: e.target.value})} className="w-full p-2 border rounded-lg bg-background" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm mb-1">Description</label>
              <textarea required value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full p-2 border rounded-lg bg-background" rows={3} />
            </div>
          </div>
          <button type="submit" disabled={createMutation.isPending} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-transform hover:scale-105">
            {createMutation.isPending ? "Creating..." : "Save Project"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project: any) => (
          <div key={project._id} className="flex items-center justify-between p-4 border rounded-2xl bg-card hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                {project.coverImage ? (
                  <img src={getImageUrl(project.coverImage)} alt={project.title} onError={(e) => { e.currentTarget.style.display = "none" }} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-lg">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.location} • {project.completionYear}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/admin/project/${project._id}`} className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  if (confirm("Are you sure? This deletes all categories and media too.")) {
                    deleteMutation.mutate(project._id);
                  }
                }}
                className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-muted-foreground py-8 text-center">No projects found.</p>}
      </div>
    </div>
  );
}
