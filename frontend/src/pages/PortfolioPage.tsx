import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/lib/api";
import { MapPin, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/SEO";
import { getImageUrl } from "@/lib/utils";

export default function PortfolioPage() {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjects(),
    staleTime: 1000 * 60 * 5, // 5 minute local cache to prevent redundant fetches
  });

  const locations = useMemo(() => {
    const locs = new Set(projects.map((p: any) => p.location));
    return Array.from(locs);
  }, [projects]);

  const filtered = useMemo(() => {
    if (!activeLocation) return projects;
    return projects.filter((p: any) => p.location === activeLocation);
  }, [activeLocation, projects]);

  process.env.NODE_ENV === "development" && console.log("Projects:", projects);

  return (
    <main className="pt-24 pb-32">
      <SEO 
        title="Best Interior Design Projects in Ahmedabad & Gujarat | Deep Interior Portfolio"
        description="Explore the luxury interior design portfolio of Deep Interior across Gujarat, featuring premier residential, commercial, bedroom, and modular kitchen projects in Ahmedabad, Sola, and Science City."
        keywords="best interior designer portfolio Ahmedabad, luxury home interiors Gujarat, residential interior projects Ahmedabad, commercial interior design Gujarat, top interior decorators Sola"
        url="https://deepinterior.com/portfolio"
      />
      
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
          className="max-w-2xl"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Portfolio</p>
          <h1 className="font-display text-5xl md:text-7xl tracking-display text-foreground mt-4 leading-[0.95]">
            Our Completed Projects
          </h1>
          <p className="text-foreground/70 mt-6 text-lg leading-relaxed">
            Explore our work across Gujarat — from concept renders to finished spaces.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 mt-16">
          {/* Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0, 0, 1] }}
            className="lg:w-64 shrink-0"
          >
            <div className="lg:sticky lg:top-28">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
                Filter by Location
              </h3>
              <div className="flex flex-row lg:flex-col gap-2">
                <button
                  onClick={() => setActiveLocation(null)}
                  className={`text-left text-sm px-4 py-3 rounded-xl transition-brand ${
                    !activeLocation
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  All Locations
                </button>
                {locations.map((loc: any) => {
                  const count = projects.filter((p: any) => p.location === loc).length;
                  return (
                    <button
                      key={loc}
                      onClick={() => setActiveLocation(loc)}
                      className={`text-left text-sm px-4 py-3 rounded-xl transition-brand flex items-center justify-between gap-3 ${
                        activeLocation === loc
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        {loc}
                      </span>
                      <span className="text-xs opacity-60">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.aside>

          {/* Project Grid */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-5">
                      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-24 text-destructive">
                  Error loading projects.
                </div>
              ) : (
                <motion.div
                  key={activeLocation || "all"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filtered.map((project: any, i: number) => {
                  console.log("Image URL:", project.coverImage);
                  return (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.2, 0, 0, 1] }}
                  >
                    <Link to={`/project/${project._id}`} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                        <img
                          src={getImageUrl(project.coverImage)}
                          alt={project.title}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => { e.currentTarget.style.display = "none" }}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                          <span className="inline-flex items-center gap-1.5 text-primary-foreground text-sm font-medium">
                            View Project <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>

                      <div className="mt-5">
                        <h3 className="font-display text-2xl tracking-display text-foreground group-hover:text-primary transition-brand">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" /> {project.location}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" /> {project.completionYear}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/60 leading-relaxed mt-3 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                  );
                })}
              </motion.div>
              )}
            </AnimatePresence>

            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-24">
                <p className="text-muted-foreground">No projects found for this location.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
