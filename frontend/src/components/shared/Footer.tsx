import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <img src="/src/assets/icon.png" alt="Deep Interior Logo" className="h-10 md:h-12 w-auto object-contain" />
              <h3 className="font-display text-3xl md:text-4xl tracking-display text-foreground">
                Deep Interior
              </h3>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              Trusted interior designers and architects in Ahmedabad — crafting bespoke residential and commercial spaces across Gujarat.
            </p>
            <div className="mt-5 space-y-2 text-base text-muted-foreground">
              <p>+91 98796 24474</p>
              <p>deepinterior74@gmail.com</p>
              <p>G.F-18, Shukan Mall 1, Science City Rd, Sola, Ahmedabad – 380060</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-5">Navigate</h4>
            <ul className="space-y-4">
              {[
                { label: "Portfolio", to: "/portfolio" },
                { label: "About", to: "/about" },
                { label: "Contact", to: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-lg text-foreground/80 hover:text-foreground transition-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-5">Connect</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="https://www.instagram.com/interiordeep" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg text-foreground/80 hover:text-foreground transition-brand group"
                >
                  <Instagram className="w-5 h-5 group-hover:text-pink-500 transition-colors" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/share/1B3UALzH4S/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg text-foreground/80 hover:text-foreground transition-brand group"
                >
                  <Facebook className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
                  <span>Facebook</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col justify-center items-center gap-6">
          <p className="text-xl font-bold text-foreground text-center">
            © 2026 Deep Interior. All rights reserved.
          </p>
          <div className="flex gap-8">
            <span className="text-base text-muted-foreground cursor-pointer hover:text-foreground transition-brand">Privacy</span>
            <span className="text-base text-muted-foreground cursor-pointer hover:text-foreground transition-brand">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
