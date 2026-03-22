import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import SEO from "@/components/SEO";

export default function ServicePage() {
  return (
    <main className="pt-24 pb-24">
      <SEO 
        title="Our Services | Deep Interior"
        description="Comprehensive architectural planning, premium interior execution, and turnkey solutions by Deep Interior in Ahmedabad."
        keywords="interior services, architecture Ahmedabad, turnkey solutions, residential design, commercial interiors"
        url="https://deepinterior.com/services"
      />
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          className="w-full max-w-7xl mx-auto"
        >
          <div className="text-center max-w-3xl mx-auto mb-20 mt-10">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight font-[500] text-slate-900 leading-[1.1] mb-6">
              Our Interior Design Services
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-[300] leading-relaxed">
              Thoughtfully designed solutions tailored for modern living and working spaces.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 pb-20">
            {/* Service 1 */}
            <div className="bg-white p-10 md:p-14 border border-slate-200/60 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] rounded-[2.5rem] flex flex-col group hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] transition-all duration-300">
              <div className="w-16 h-16 bg-[#f4f7f6] rounded-2xl flex items-center justify-center mb-8 text-[#556b60]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"/><path d="M17 2v20"/><path d="M7 2v20"/><path d="M12 22V7"/><path d="m2 12 5-5 5 5"/><path d="m12 12 5-5 5 5"/></svg>
              </div>
              <h3 className="text-[26px] font-display font-[600] text-slate-800 mb-4 tracking-tight">
                Turnkey Interior Solutions
              </h3>
              <p className="text-[16px] text-slate-500 font-[300] leading-relaxed mb-10">
                End-to-end interior services handled with complete responsibility, ensuring a smooth and stress-free experience.
              </p>
              <ul className="space-y-4 flex-grow">
                {[
                  "Complete project planning and execution",
                  "Material selection and vendor coordination",
                  "On-site supervision and quality control",
                  "Timeline and budget management",
                  "Ready-to-move-in delivery"
                ].map((point, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="w-[20px] h-[20px] text-[#556b60] shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-[15.5px] text-slate-600 leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-10 md:p-14 border border-slate-200/60 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] rounded-[2.5rem] flex flex-col group hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] transition-all duration-300">
              <div className="w-16 h-16 bg-[#f4f7f6] rounded-2xl flex items-center justify-center mb-8 text-[#556b60]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <h3 className="text-[26px] font-display font-[600] text-slate-800 mb-4 tracking-tight">
                Residential Interior Design
              </h3>
              <p className="text-[16px] text-slate-500 font-[300] leading-relaxed mb-10">
                Creating personalized living spaces that reflect comfort, functionality, and modern aesthetics.
              </p>
              <ul className="space-y-4 flex-grow">
                {[
                  "Living room, bedroom, and kitchen design",
                  "Custom furniture and storage solutions",
                  "Lighting and color coordination",
                  "Space optimization for daily use",
                  "Elegant and practical layouts"
                ].map((point, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="w-[20px] h-[20px] text-[#556b60] shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-[15.5px] text-slate-600 leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-10 md:p-14 border border-slate-200/60 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] rounded-[2.5rem] flex flex-col group hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] transition-all duration-300">
              <div className="w-16 h-16 bg-[#f4f7f6] rounded-2xl flex items-center justify-center mb-8 text-[#556b60]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
              </div>
              <h3 className="text-[26px] font-display font-[600] text-slate-800 mb-4 tracking-tight">
                Commercial Interior Design
              </h3>
              <p className="text-[16px] text-slate-500 font-[300] leading-relaxed mb-10">
                Designing professional environments that enhance productivity and create a strong visual identity.
              </p>
              <ul className="space-y-4 flex-grow">
                {[
                  "Office and workspace planning",
                  "Retail and showroom interiors",
                  "Functional and ergonomic layouts",
                  "Brand-focused design elements",
                  "Efficient use of available space"
                ].map((point, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="w-[20px] h-[20px] text-[#556b60] shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-[15.5px] text-slate-600 leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

             {/* Service 4 */}
            <div className="bg-white p-10 md:p-14 border border-slate-200/60 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] rounded-[2.5rem] flex flex-col group hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] transition-all duration-300">
              <div className="w-16 h-16 bg-[#f4f7f6] rounded-2xl flex items-center justify-center mb-8 text-[#556b60]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg> 
              </div>
              <h3 className="text-[26px] font-display font-[600] text-slate-800 mb-4 tracking-tight">
                Design Consultation & Planning
              </h3>
              <p className="text-[16px] text-slate-500 font-[300] leading-relaxed mb-10">
                Expert advice to help you make informed decisions before starting your project.
              </p>
              <ul className="space-y-4 flex-grow">
                {[
                  "Layout and space analysis",
                  "Concept and theme development",
                  "Budget and material guidance",
                  "Design recommendations",
                  "3D visualization support"
                ].map((point, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="w-[20px] h-[20px] text-[#556b60] shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-[15.5px] text-slate-600 leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </motion.div>
      </div>
    </main>
  );
}
