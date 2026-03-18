import { motion } from "framer-motion";
import SEO from "@/components/SEO";

export default function AboutPage() {
  return (
    <main className="pt-24 pb-24">
      <SEO 
        title="About Deep Interior | Best Interior Designer in Ahmedabad & Gujarat"
        description="Deep Interior Designers and Architects is the best interior designer in Ahmedabad for luxury residential interior design, architecture, and turnkey home renovations across Sola, Science City, and Gujarat."
        keywords="best interior designer in Ahmedabad, luxury interior design company Gujarat, turnkey interior designers Ahmedabad, office interior design Ahmedabad, home renovations Ahmedabad, interior designer in Gujarat"
        url="https://deepinterior.com/about"
      />
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground">About</p>
          <h1 className="font-display text-4xl md:text-6xl tracking-display text-foreground mt-3 leading-[0.95]">
            Design Is an Expression<br />of Values
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
