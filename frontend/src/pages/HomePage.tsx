import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-living.webp";
import { projects, roomCategories } from "@/lib/data";
import { Star, MapPin, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects, fetchGoogleReviews } from "@/lib/api";
import SEO from "@/components/SEO";
import { getImageUrl } from "@/lib/utils";

import livingImg from "@/assets/design-living.webp";
import kitchenImg from "@/assets/design-kitchen.webp";
import bedroomImg from "@/assets/design-bedroom.webp";
import bathroomImg from "@/assets/design-bathroom.webp";
import officeImg from "@/assets/design-office.webp";

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

  // Development logs removed

  return (
    <main id="main-content">
      <SEO 
        title="Best Interior Designer in Ahmedabad | Deep Interior"
        description="Deep Interior offers premium residential and commercial interior design services in Ahmedabad, Gandhinagar, Surat, and across Gujarat. Custom furniture, modular kitchens, false ceilings, and complete turnkey interiors."
        keywords="interior designer in Ahmedabad, interior design Ahmedabad, best interior designer Gujarat, modular kitchen Ahmedabad, furniture designer Ahmedabad, residential interior design Gujarat, commercial interior design Ahmedabad, false ceiling design Ahmedabad, turnkey interior Ahmedabad, home interior Gujarat"
        schema={JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
            "name": "Deep Interior",
            "description": "Deep Interior is a premium interior design studio in Ahmedabad offering residential interior design, commercial interior design, modular kitchens, false ceiling, and full turnkey interior projects across Gujarat.",
            "url": "https://deep-interior.vercel.app",
            "logo": "https://deep-interior.vercel.app/01-01.webp",
            "image": "https://deep-interior.vercel.app/og-image.jpg",
            "telephone": "+91-9879624474",
            "email": "deepinterior74@gmail.com",
            "priceRange": "₹₹–₹₹₹",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "G.F-18, Shukan Mall 1, Science City Rd, Sola",
              "addressLocality": "Ahmedabad",
              "addressRegion": "Gujarat",
              "postalCode": "380060",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "23.0722",
              "longitude": "72.5164"
            },
            "areaServed": [
              "Ahmedabad", "Gandhinagar", "Surat", "Vadodara", "Rajkot", "Gujarat"
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Interior Design Services",
              "itemListElement": [
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Residential Interior Design in Ahmedabad"}},
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Commercial Interior Design in Ahmedabad"}},
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Modular Kitchen Design Ahmedabad"}},
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "False Ceiling Design Ahmedabad"}},
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Office Interior Design Gujarat"}},
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Turnkey Interior Projects Ahmedabad"}}
              ]
            },
            "openingHours": "Mo-Sa 09:30-19:00",
            "sameAs": [
              "https://www.instagram.com/interiordeep",
              "https://www.facebook.com/share/1B3UALzH4S/"
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What interior design services does Deep Interior offer in Ahmedabad?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Deep Interior offers complete residential and commercial interior design services in Ahmedabad including living room design, bedroom interiors, modular kitchens, false ceiling, wallpaper, office interiors, and full turnkey interior projects across Gujarat."
                }
              },
              {
                "@type": "Question",
                "name": "How much does interior design cost in Ahmedabad?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Interior design costs in Ahmedabad typically range from ₹800 to ₹3,000 per sq ft depending on the scope, materials, and finishes chosen. Deep Interior offers packages for all budgets — contact us for a free consultation and quote."
                }
              },
              {
                "@type": "Question",
                "name": "Does Deep Interior work across all areas of Ahmedabad?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Deep Interior serves all major areas of Ahmedabad including Bopal, South Bopal, Prahlad Nagar, Satellite, Thaltej, SG Highway, Bodakdev, Vastrapur, Gota, Chandkheda, Navrangpura, Maninagar, Nikol, and surrounding areas."
                }
              },
              {
                "@type": "Question",
                "name": "Does Deep Interior take projects outside Ahmedabad in Gujarat?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we take on interior design projects across Gujarat including Gandhinagar, Surat, Vadodara, and Rajkot. Contact us to discuss your project location."
                }
              },
              {
                "@type": "Question",
                "name": "How long does a complete home interior design project take in Ahmedabad?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A typical 2BHK or 3BHK home interior project in Ahmedabad takes 45 to 90 days from design approval to handover, depending on the scope and material availability. Deep Interior provides a clear timeline before work begins."
                }
              },
              {
                "@type": "Question",
                "name": "Does Deep Interior provide modular kitchen design in Ahmedabad?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, modular kitchen design and installation is one of our core services in Ahmedabad. We offer L-shaped, U-shaped, parallel, and island kitchen designs with a choice of finishes, shutters, and hardware to suit your budget."
                }
              }
            ]
          }
        ])}
      />
      
      {/* Hero */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Luxury residential properties in Ahmedabad Gujarat"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
        />
        {/* Bottom gradient to protect text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        
        <div className="relative container mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
            className="max-w-4xl"
          >
            <h1 className="font-display text-4xl md:text-6xl lg:text-[76px] font-[600] tracking-tight leading-[1.05] text-[#ffffff] drop-shadow-sm">
              Interior Designer in Ahmedabad — Transform Your Space
            </h1>
            <p className="text-[#eaeaea] text-lg md:text-[20px] mt-6 max-w-2xl leading-[1.6] font-[300] drop-shadow-md">
              Crafting beautiful homes and spaces across Gujarat.
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
                    alt={`${cat} for sale in Ahmedabad, Gujarat`}
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
              <h2 className="font-display text-5xl md:text-6xl tracking-display text-foreground mt-3">
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
                        alt={`${project.title} for sale in ${project.location}, Ahmedabad`}
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
                      <img 
                        src={t.profile_photo_url || "/"} 
                        alt={`${t.name} — Client at Deep Interior`} 
                        className={`w-9 h-9 rounded-full object-cover shrink-0 ${t.profile_photo_url ? 'block' : 'hidden'}`} 
                        loading="lazy" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                          if (fallback) (fallback as HTMLElement).style.display = 'flex';
                        }} 
                      />
                      <div 
                        className={`avatar-fallback w-9 h-9 rounded-full bg-primary items-center justify-center shrink-0 ${t.profile_photo_url ? 'hidden' : 'flex'}`}
                      >
                        <span className="text-primary-foreground text-xs font-medium">{userInitials}</span>
                      </div>
                      <span className="text-sm text-foreground">{t.name}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-6 text-foreground/80 leading-relaxed text-sm md:text-base">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">Premier Interior Design in Ahmedabad</h2>
            <p>
              Deep Interior is your premier partner for transforming spaces across Ahmedabad and Gujarat. Whether you are looking to design a luxurious bungalow in Science City, a modern commercial workspace in Sola, or perfectly optimize your new 3BHK family flat, our expertise covers every aspect of residential and commercial interior design.
            </p>
            <p>
              Ahmedabad is rapidly evolving, with homes and businesses requiring smarter, more elegant design solutions. We specialize in bringing high-value aesthetic transformations—from detailed false ceilings and intelligent lighting to bespoke modular kitchens and custom furniture. We help our clients shape beautiful spaces across Gujarat's expanding horizons.
            </p>
            <p>
              Our turnkey interior and architectural services are seamlessly handled from concept to handover. When you choose Deep Interior, you gain access to a dedicated team capable of transforming any space into your dream home or a highly functional office. Our end-to-end solutions include material selection, custom layouts, and comprehensive project execution, ensuring that your space perfectly reflects your lifestyle.
            </p>
            <p>
              Whether you are a local homeowner elevating your living space or a business establishing a dynamic office, we provide transparent, tailored, and professional guidance. Let us help you unlock the true potential of your property and turn it into a beautifully crafted space.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ & Areas We Serve Section */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="font-display text-4xl text-foreground mb-8">Interior Design Across Ahmedabad & Gujarat</h2>
            <div className="prose prose-zinc dark:prose-invert text-muted-foreground text-lg">
              <p className="mb-4">
                Deep Interior brings thoughtful, premium interior design to every corner 
                of Ahmedabad. We work across Bopal, South Bopal, Prahlad Nagar, Satellite, 
                SG Highway, Thaltej, Bodakdev, Vastrapur, Navrangpura, Gota, Chandkheda, 
                New Ranip, Maninagar, and Nikol — whether you're furnishing a new 2BHK flat 
                or redesigning a 4BHK bungalow.
              </p>
              <p>
                Beyond Ahmedabad, our team takes on interior design projects across Gujarat 
                including Gandhinagar, Surat, Vadodara, and Rajkot. We manage everything 
                from concept to completion so you don't have to worry about a thing.
              </p>
            </div>
          </div>
          <div>
            <h2 className="font-display text-4xl text-foreground mb-8">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-4 max-w-xl">
              <details className="group border-b border-border pb-4">
                <summary className="font-medium text-lg cursor-pointer flex justify-between items-center text-foreground">
                  What interior design services does Deep Interior offer in Ahmedabad?
                  <span className="text-xl group-open:rotate-45 transition-transform duration-300">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Deep Interior offers complete residential and commercial interior design services in Ahmedabad including living room design, bedroom interiors, modular kitchens, false ceiling, wallpaper, office interiors, and full turnkey interior projects across Gujarat.
                </p>
              </details>
              <details className="group border-b border-border pb-4">
                <summary className="font-medium text-lg cursor-pointer flex justify-between items-center text-foreground">
                  How much does interior design cost in Ahmedabad?
                  <span className="text-xl group-open:rotate-45 transition-transform duration-300">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Interior design costs in Ahmedabad typically range from ₹800 to ₹3,000 per sq ft depending on the scope, materials, and finishes chosen. Deep Interior offers packages for all budgets — contact us for a free consultation and quote.
                </p>
              </details>
              <details className="group border-b border-border pb-4">
                <summary className="font-medium text-lg cursor-pointer flex justify-between items-center text-foreground">
                  Does Deep Interior work across all areas of Ahmedabad?
                  <span className="text-xl group-open:rotate-45 transition-transform duration-300">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Yes, Deep Interior serves all major areas of Ahmedabad including Bopal, South Bopal, Prahlad Nagar, Satellite, Thaltej, SG Highway, Bodakdev, Vastrapur, Gota, Chandkheda, Navrangpura, Maninagar, Nikol, and surrounding areas.
                </p>
              </details>
              <details className="group border-b border-border pb-4">
                <summary className="font-medium text-lg cursor-pointer flex justify-between items-center text-foreground">
                  Does Deep Interior take projects outside Ahmedabad in Gujarat?
                  <span className="text-xl group-open:rotate-45 transition-transform duration-300">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Yes, we take on interior design projects across Gujarat including Gandhinagar, Surat, Vadodara, and Rajkot. Contact us to discuss your project location.
                </p>
              </details>
              <details className="group border-b border-border pb-4">
                <summary className="font-medium text-lg cursor-pointer flex justify-between items-center text-foreground">
                  How long does a complete home interior design project take in Ahmedabad?
                  <span className="text-xl group-open:rotate-45 transition-transform duration-300">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  A typical 2BHK or 3BHK home interior project in Ahmedabad takes 45 to 90 days from design approval to handover, depending on the scope and material availability. Deep Interior provides a clear timeline before work begins.
                </p>
              </details>
              <details className="group border-b border-border pb-4">
                <summary className="font-medium text-lg cursor-pointer flex justify-between items-center text-foreground">
                  Does Deep Interior provide modular kitchen design in Ahmedabad?
                  <span className="text-xl group-open:rotate-45 transition-transform duration-300">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Yes, modular kitchen design and installation is one of our core services in Ahmedabad. We offer L-shaped, U-shaped, parallel, and island kitchen designs with a choice of finishes, shutters, and hardware to suit your budget.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-7xl tracking-display text-foreground">
            If You Can Dream It. <br />We Can Make It
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
