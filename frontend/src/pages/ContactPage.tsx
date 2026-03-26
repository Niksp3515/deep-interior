import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import SEO from "@/components/SEO";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    location: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Additional manual validation before WhatsApp redirect
    if (formData.mobile.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    const { name, email, mobile, location, message } = formData;
    
    const whatsappMessage = `Hello, my name is ${name}.

I am interested in interior design services.

Project Location: ${location}

My Mobile Number: ${mobile}

Message:
${message}

Please contact me as soon as possible.`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/919879624474?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main className="pt-24 pb-24">
      <SEO 
        title="Contact Deep Interior — Interior Designer in Ahmedabad"
        description="Get in touch with Deep Interior for interior design consultations and furniture projects in Ahmedabad, Surat, Vadodara, and Gujarat."
        keywords="contact best interior designer Ahmedabad, luxury interior design consultation, home renovation quotes Gujarat, office interior designers Sola"
        url="https://deep-interior.vercel.app/contact"
        schema={JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://deep-interior.vercel.app/"},
            {"@type": "ListItem", "position": 2, "name": "Contact", "item": "https://deep-interior.vercel.app/contact"}
          ]
        })}
      />
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Contact</p>
          <h1 className="font-display text-5xl md:text-7xl tracking-display text-foreground mt-4 leading-[0.95] max-w-2xl">
            Get a Free Design Consultation in Ahmedabad
          </h1>

          <div className="flex flex-col gap-4 mt-8">
            <a href="tel:+919879624474" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4" /> +91 98796 24474
            </a>
            <a href="mailto:deepinterior74@gmail.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-4 h-4" /> deepinterior74@gmail.com
            </a>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=G.F-18+Shukan+Mall+1+Science+City+Road+Sola+Ahmedabad+380060"
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /> 
              <span>G.F-18, Shukan Mall 1, Near Panchamrut Bungalow, Science City Rd, Sola, Ahmedabad – 380060, Gujarat, India</span>
            </a>
          </div>

          {/* Map Preview */}
          <div className="mt-10 group relative rounded-2xl overflow-hidden aspect-[21/9] bg-muted border border-border shadow-sm hover:shadow-md transition-shadow">
            <iframe 
              src="https://maps.google.com/maps?q=Shukan%20Mall,%20Science%20City%20Rd,%20Sola,%20Ahmedabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 pointer-events-auto"
            ></iframe>
            {/* Directions Overlay Button */}
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=G.F-18+Shukan+Mall+1+Science+City+Road+Sola+Ahmedabad+380060"
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-lg shadow-md hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 border border-border/50 text-foreground z-10"
            >
              <MapPin className="w-4 h-4 text-primary" fill="currentColor" />
              <span className="font-semibold text-sm">Open in Maps</span>
            </a>
          </div>

            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    minLength={2}
                    maxLength={100}
                    title="Please enter a valid full name (minimum 2 characters)."
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 text-foreground outline-none ring-1 ring-border focus:ring-primary/50 text-sm placeholder:text-muted-foreground transition-all"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    maxLength={255}
                    title="Please enter a valid email address."
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 text-foreground outline-none ring-1 ring-border focus:ring-primary/50 text-sm placeholder:text-muted-foreground transition-all"
                    placeholder="Your email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-medium">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    pattern="[0-9]{10,15}"
                    title="Please enter a valid mobile number (10 to 15 digits)."
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 text-foreground outline-none ring-1 ring-border focus:ring-primary/50 text-sm placeholder:text-muted-foreground transition-all"
                    placeholder="Your mobile number"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-medium">Project Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    minLength={3}
                    maxLength={255}
                    title="Please specify the city or area of your project."
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 text-foreground outline-none ring-1 ring-border focus:ring-primary/50 text-sm placeholder:text-muted-foreground transition-all"
                    placeholder="Location of your new house or project"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2 font-medium">Message</label>
                  <textarea
                    name="message"
                    required
                    minLength={10}
                    maxLength={2000}
                    title="Please provide a brief description of your requirements (min 10 characters)."
                    rows={5}
                    value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-secondary/50 text-foreground outline-none ring-1 ring-border focus:ring-primary/50 text-sm placeholder:text-muted-foreground resize-none transition-all"
                  placeholder="Tell us about your interior design requirements"
                />
              </div>
              
              <button
                type="submit"
                className="w-full md:w-auto px-10 py-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-brand hover:scale-[0.99] hover:shadow-lg shadow-primary/20"
              >
                Send Message via WhatsApp
              </button>
            </form>
        </motion.div>
      </div>
    </main>
  );
}
