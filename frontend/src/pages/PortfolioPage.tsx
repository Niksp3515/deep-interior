import { useState, useMemo, useEffect } from "react";
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
    retry: 1, // Only retry once to avoid infinite spinning
  });

  const [isTimeout, setIsTimeout] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && projects.length === 0) {
        setIsTimeout(true);
      }
    }, 5000); // 5 second timeout
    return () => clearTimeout(timeout);
  }, [isLoading, projects.length]);

  const locations = useMemo(() => {
    const locs = new Set(projects.map((p: any) => p.location));
    return Array.from(locs);
  }, [projects]);

  const filtered = useMemo(() => {
    if (!activeLocation) return projects;
    return projects.filter((p: any) => p.location === activeLocation);
  }, [activeLocation, projects]);

  // Development logs removed

  return (
    <main className="pt-24 pb-32">
      <SEO 
        title="Interior Design Portfolio — Projects in Ahmedabad & Gujarat | Deep Interior"
        description="Browse our completed interior design and furniture projects in Ahmedabad, Gandhinagar, and across Gujarat. From bungalows to 2BHK and 3BHK flats."
        keywords="best interior designer portfolio Ahmedabad, luxury home interiors Gujarat, residential interior projects Ahmedabad, commercial interior design Gujarat, top interior decorators Sola"
        url="https://deep-interior.vercel.app/portfolio"
        schema={JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://deep-interior.vercel.app/"},
            {"@type": "ListItem", "position": 2, "name": "Portfolio", "item": "https://deep-interior.vercel.app/portfolio"}
          ]
        })}
      />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 mt-16">
          {/* Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0, 0, 1] }}
            className="lg:w-64 shrink-0"
          >
            <div className="lg:sticky lg:top-28">
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
                Filter by Location
              </h2>
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
              ) : (error || isTimeout) ? (
                <div className="text-center py-24 text-muted-foreground bg-card rounded-2xl border border-border">
                  <p className="mb-4 text-lg">Projects are currently unavailable.</p>
                  <a href="https://wa.me/919879624474" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2">
                    Contact us on WhatsApp to see our work <ArrowRight className="w-4 h-4" />
                  </a>
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
                          alt={`${project.title} for sale in ${project.location}, Ahmedabad`}
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
                        <h2 className="font-display text-2xl tracking-display text-foreground group-hover:text-primary transition-brand">
                          {project.title}
                        </h2>
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
