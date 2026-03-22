import { Link } from "react-router-dom";
import { Instagram, Facebook, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import BookingModal from "./BookingModal";

export default function Footer() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <footer className="bg-[#f5f7f9] pt-16 pb-8 text-[#333]">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 items-start text-left mb-12">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-start -mt-4">
              <img src="/01-01.png" alt="Deep Interior Logo" className="w-[140px] md:w-[160px] h-auto object-contain object-left pointer-events-none" />
            </div>
            
            <div className="space-y-3 text-[15px] text-slate-500 mb-6 mt-2">
              <a href="tel:+919879624474" className="flex items-start gap-4 hover:text-primary transition-colors group">
                <Phone className="w-[18px] h-[18px] mt-0.5 text-slate-400 shrink-0 group-hover:text-primary transition-colors" />
                <span>+91 98796 24474</span>
              </a>
              <a href="mailto:deepinterior74@gmail.com" className="flex items-start gap-4 hover:text-primary transition-colors group">
                <Mail className="w-[18px] h-[18px] mt-0.5 text-slate-400 shrink-0 group-hover:text-primary transition-colors" />
                <span>deepinterior74@gmail.com</span>
              </a>
              <a href="https://maps.google.com/?q=Shukan Mall 1, Science City Rd, Sola, Ahmedabad" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 hover:text-primary transition-colors group">
                <MapPin className="w-[18px] h-[18px] mt-0.5 text-slate-400 shrink-0 group-hover:text-primary transition-colors" />
                <span className="max-w-[220px] leading-relaxed">
                  Shukan Mall 1, Science City Rd, Sola, Ahmedabad
                </span>
              </a>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <a 
                href="https://www.instagram.com/interiordeep" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#e8ebea] flex items-center justify-center text-[#556b60] hover:text-white hover:bg-pink-600 transition-colors shadow-sm"
              >
                <Instagram className="w-[20px] h-[20px]" />
              </a>
              <a 
                href="https://www.facebook.com/share/1B3UALzH4S/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#e8ebea] flex items-center justify-center text-[#556b60] hover:text-white hover:bg-blue-600 transition-colors shadow-sm"
              >
                <Facebook className="w-[20px] h-[20px]" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigate */}
          <div className="flex flex-col lg:pl-8">
            <h4 className="text-[14px] font-[600] tracking-[0.15em] text-slate-800 mb-6 mt-8 uppercase">Navigate</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", to: "/" },
                { label: "About", to: "/about" },
                { label: "Services", to: "/services" },
                { label: "Portfolio", to: "/portfolio" },
                { label: "Contact", to: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-[15px] text-slate-500 hover:text-primary transition-colors block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col">
            <h4 className="text-[14px] font-[600] tracking-[0.15em] text-slate-800 mb-6 mt-8 uppercase">Our Services</h4>
            <ul className="space-y-3">
              {[
                "Residential Interior",
                "Commercial Interior",
                "Space Planning",
                "3D Design",
              ].map((service) => (
                <li key={service}>
                  <span className="text-[15px] text-slate-500 cursor-default block">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: CTA Section */}
          <div className="flex flex-col">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col items-start w-full max-w-[340px]">
              <h4 className="text-[22px] font-display font-serif font-medium text-slate-800 mb-4">
                Start Your Dream Space
              </h4>
              <p className="text-[15px] text-slate-500 mb-8 leading-[1.6]">
                Let's bring your vision to life<br />— get expert guidance today.
              </p>
              <button 
                onClick={() => setIsBookingModalOpen(true)}
                className="inline-flex items-center justify-center rounded-xl text-[15px] font-[500] transition-all bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 shadow-sm hover:-translate-y-0.5"
              >
                Book Free Consultation
                <ArrowRight className="w-[18px] h-[18px] ml-2" />
              </button>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-200/80 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[14px] text-slate-400">
            © {new Date().getFullYear()} Deep Interior. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-[14px] text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">Privacy Policy</span>
            <span className="text-[14px] text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>

      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </footer>
  );
}
