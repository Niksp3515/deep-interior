import { motion } from "framer-motion";
import SEO from "@/components/SEO";

export default function AboutPage() {
  return (
    <main className="pt-24 pb-24">
      <SEO 
        title="About Deep Interior — Interior Designers in Ahmedabad"
        description="Learn about Deep Interior, Ahmedabad's trusted interior design and custom furniture company with 500+ completed projects across Gujarat."
        url="https://deep-interior.vercel.app/about"
      />
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground">About</p>
          <h1 className="font-display text-5xl md:text-7xl tracking-display text-foreground mt-4 leading-[0.95]">
            About Deep Interior — Ahmedabad's Trusted Design Studio
          </h1>
          <div className="mt-12 space-y-6 text-foreground/80 leading-relaxed">
            <p>
              Deep Interior Designers and Architects is the leading name in Ahmedabad for luxury interior design, architecture, and bespoke renovation services. We focus on professional architectural planning, premium interior execution, and turnkey solutions for residential and commercial spaces across Sola, Science City, and Gujarat.
            </p>
            <p>
              Our team delivers end-to-end solutions — from home and office renovations to turnkey projects. We treat each space as a unique opportunity to blend functionality with aesthetics, ensuring every project reflects our client's vision.
            </p>
            <p>
              With years of experience in the industry, Deep Interior has built a reputation for quality craftsmanship, attention to detail, and client satisfaction across Ahmedabad and Gujarat.
            </p>
            <h2 className="font-display text-2xl text-foreground mt-10 mb-4 pt-6 border-t border-border/40">Our Story in Gujarat's Interior Design World</h2>
            <p>
              Established with a vision to redefine the interior design landscape of Gujarat, Deep Interior is an interior design and furniture company based in Ahmedabad. Our journey began over a decade ago with a simple mission: to craft beautiful, highly functional spaces. Over the years, we have expanded our footprint, delivering extraordinary projects across Ahmedabad, Gandhinagar, Surat, Vadodara, and surrounding areas.
            </p>
            <p>
              Our unique approach bridges the gap between architectural vision and finished, liveable art. We bring unmatched expertise in residential and commercial interior design, alongside world-class custom furniture design and manufacturing. Our team handles every aspect of the process to offer true turnkey renovation and interior services, ensuring every space perfectly reflects our client's lifestyle and brand.
            </p>
            <p>
              By maintaining an unwavering commitment to quality craftsmanship, personalized design, and timely delivery, we have successfully completed over 500 interior projects. Through ethical design practices and an obsession with detail, we continue to deliver smiles to families and businesses across Gujarat's vibrant design market.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border">
            {[
              { value: "500+", label: "Projects" },
              { value: "10+", label: "Years Experience" },
              { value: "98%", label: "Client Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl md:text-4xl tracking-display text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
