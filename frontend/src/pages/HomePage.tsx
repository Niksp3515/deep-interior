import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-living.jpg";
import { projects, roomCategories } from "@/lib/data";
import { Star, MapPin, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects, fetchGoogleReviews } from "@/lib/api";
import SEO from "@/components/SEO";
import { getImageUrl } from "@/lib/utils";

import livingImg from "@/assets/design-living.jpg";
import kitchenImg from "@/assets/design-kitchen.jpg";
import bedroomImg from "@/assets/design-bedroom.jpg";
import bathroomImg from "@/assets/design-bathroom.jpg";
import officeImg from "@/assets/design-office.jpg";

const categoryImages: Record<string, string> = {
  "Living Room": livingImg,
  Kitchen: kitchenImg,
  Bedroom: bedroomImg,
  Bathroom: bathroomImg,
  "Dining Area": kitchenImg,
  "Office Space": officeImg,
};

export default function HomePage() {
  const { data: dynamicProjects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjects()
  });

  const { data: dynamicReviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const data = await fetchGoogleReviews();
      return data.filter((r: any) => r.message && r.message.length >= 20).slice(0, 3);
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  const displayProjects = dynamicProjects ? dynamicProjects.slice(0, 3) : [];

  process.env.NODE_ENV === "development" && console.log("Projects:", displayProjects);

  return (
    <main>
      <SEO 
        title="Best Interior Designer in Ahmedabad | Luxury Home Interiors | Deep Interior"
        description="Deep Interior is the best interior designer in Ahmedabad, offering luxury residential interior design, modular kitchens, and turnkey architecture in Sola, Science City, and Gujarat."
        keywords="best interior designer in Ahmedabad, interior designer in Gujarat, home interior designer Ahmedabad, luxury interior designer Gujarat, bedroom interior design Ahmedabad, office interior design Ahmedabad, modern home interiors Gujarat"
        schema={JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Deep Interior",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "G.F-18, Shukan Mall 1, Science City Rd, Sola",
            "addressLocality": "Ahmedabad",
            "postalCode": "380060",
            "addressRegion": "Gujarat",
            "addressCountry": "IN"
          },
          "telephone": "+919879624474",
          "email": "deepinterior74@gmail.com",
          "url": "https://deepinterior.com",
          "description": "Deep Interior is the top interior designer in Ahmedabad offering luxury residential interior design, office spaces, and turnkey architecture in Sola, Science City, and across Gujarat."
        })}
      />
      
      {/* Hero */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Deep Interior - Luxury interior design and architecture in Ahmedabad"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
        />
        {/* Soft bottom gradient to protect text contrast without dulling the entire image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative container mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
            className="max-w-4xl"
          >
            <h1 className="font-display text-4xl md:text-6xl lg:text-[76px] font-[600] tracking-tight leading-[1.05] text-[#ffffff] drop-shadow-sm">
              Spaces That Speak Before You Do
            </h1>
            <p className="text-[#eaeaea] text-lg md:text-[20px] mt-6 max-w-2xl leading-[1.6] font-[300] drop-shadow-md">
              Deep Interior — where design becomes emotion, and every space is shaped to feel bold, timeless, and unmistakably yours.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/portfolio"
                className="px-8 py-4 rounded-xl bg-white text-slate-900 text-[15px] font-[500] transition-all hover:bg-white/90 shadow-sm"
              >
                View Portfolio
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 rounded-xl border border-white/20 text-white text-[15px] font-[500] backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Room Categories */}
      <section className="py-28">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Expertise</p>
            <h2 className="font-display text-4xl md:text-6xl tracking-display text-foreground mt-3">
              Spaces We Design
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {roomCategories.filter(cat => cat !== "Dining Area" && cat !== "Bathroom").map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link to={`/category/${cat}`} className="group relative block aspect-[3/4] rounded-2xl overflow-hidden bg-muted cursor-pointer">
                  <img
                    src={categoryImages[cat]}
                    alt={`Luxury ${cat} interior design and architecture tailored for modern homes in Gujarat`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-primary-foreground text-sm font-medium">{cat}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-28 bg-card">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Portfolio</p>
              <h2 className="font-display text-4xl md:text-6xl tracking-display text-foreground mt-3">
                Featured Projects
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-brand"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isProjectsLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className={`grid gap-8 ${
              displayProjects.length === 1 ? "grid-cols-1 max-w-3xl mx-auto" :
              displayProjects.length === 2 ? "grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto" :
              "grid-cols-1 md:grid-cols-3"
            }`}>
              {displayProjects.map((project: any, i: number) => {
                console.log("Image URL:", project.coverImage);
                return (
                <motion.div
                  key={project._id || project.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <Link to={`/project/${project._id || project.id}`} className="group block">
                    <div className={`relative overflow-hidden rounded-2xl bg-muted ${displayProjects.length === 1 ? "aspect-video" : "aspect-[4/3]"}`}>
                      <img
                        src={getImageUrl(project.coverImage)}
                        alt={`Premium interior design project: ${project.title} by Deep Interior`}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { e.currentTarget.style.display = "none" }}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="mt-4">
                      <h3 className="font-display text-xl tracking-display text-foreground group-hover:text-primary transition-brand">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" /> {project.location}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" /> {project.completionYear}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28">
        <div className="container mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Testimonials</p>
          <h2 className="font-display text-4xl md:text-6xl tracking-display text-foreground mt-3 mb-14">
            Client Stories
          </h2>

          {isReviewsLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dynamicReviews?.map((t: any, i: number) => {
                const userInitials = t.name ? t.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
                
                return (
                  <motion.div
                    key={t._id || t.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="rounded-2xl ring-subtle p-8 bg-card flex flex-col h-full"
                  >
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed italic flex-grow">"{t.message}"</p>
                    <div className="flex items-center gap-3 mt-6">
                      {t.profile_photo_url ? (
                        <img src={t.profile_photo_url} alt={t.name} className="w-9 h-9 rounded-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <span className="text-primary-foreground text-xs font-medium">{userInitials}</span>
                        </div>
                      )}
                      <span className="text-sm text-foreground">{t.name}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-card">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-7xl tracking-display text-foreground">
            If You Can Dream It,<br />We Can Make It
          </h2>
          <p className="text-muted-foreground mt-6 max-w-md mx-auto leading-relaxed">
            Whether it's a home, office, or commercial space — Deep Interior brings your vision to life with expert design and execution.
          </p>
          <Link
            to="/contact"
            className="inline-block mt-10 px-10 py-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-brand hover:scale-[0.98]"
          >
            Start Your Project
          </Link>
        </div>
      </section>
    </main>
  );
}
