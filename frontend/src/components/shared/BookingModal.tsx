import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function BookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Extract values
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const city = formData.get("city") as string;
    const budget = formData.get("budget") as string;
    const bhk = formData.get("bhk") as string;
    const time = formData.get("time") as string;
    const requirement = formData.get("requirement") as string;

    // Construct the formatted message
    const message = `Hello, I want to book a consultation.

Name: ${name}
Email: ${email}
Phone: ${phone}
City: ${city}
BHK: ${bhk}
Budget: ${budget}
Start Time: ${time}
Requirement: ${requirement}`;

    // URL Encode
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "919879624474"; // Provided Deep Interior contact number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open in new tab and close modal
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed top-0 left-0 w-full h-full bg-black/60 z-[9998]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed top-[50%] left-[50%] z-[9999] w-[95%] max-w-[550px] max-h-[85vh] overflow-y-auto bg-[#ffffff] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-6 md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6 mt-2">
              <h2 className="text-2xl md:text-[28px] font-display font-bold text-[#1a1b36] leading-tight">
                Premium Interiors. Transparent Pricing. <br className="hidden md:block"/> Timely Delivery.
              </h2>
              <p className="mt-3 text-[13px] md:text-sm text-gray-500 max-w-[95%] mx-auto">
                End-to-end interior design solutions in Ahmedabad. With our expert team and clear pricing, we craft spaces you’ll love. Complete the form to begin.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1 text-left">
                <label className="text-[13px] font-bold text-[#1a1b36]">Full Name*</label>
                <input required name="name" type="text" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] outline-none transition-colors text-[14px]" />
              </div>
              
              <div className="space-y-1 text-left">
                <label className="text-[13px] font-bold text-[#1a1b36]">Email*</label>
                <input required name="email" type="email" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] outline-none transition-colors text-[14px]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-[13px] font-bold text-[#1a1b36]">Phone*</label>
                  <input required name="phone" type="tel" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] outline-none transition-colors text-[14px]" />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[13px] font-bold text-[#1a1b36]">City*</label>
                  <input required name="city" type="text" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] outline-none transition-colors text-[14px]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-[13px] font-bold text-[#1a1b36]">Budget *</label>
                  <select required name="budget" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] outline-none transition-colors bg-white text-[14px]">
                    <option value="">Select Budget</option>
                    <option value="5-10 Lakhs">5 - 10 Lakhs</option>
                    <option value="10-15 Lakhs">10 - 15 Lakhs</option>
                    <option value="15-20 Lakhs">15 - 20 Lakhs</option>
                    <option value="20-30 Lakhs">20 - 30 Lakhs</option>
                    <option value="30+ Lakhs">30+ Lakhs</option>
                  </select>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[13px] font-bold text-[#1a1b36]">BHK *</label>
                  <select required name="bhk" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] outline-none transition-colors bg-white text-[14px]">
                    <option value="">Select BHK</option>
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4 BHK</option>
                    <option value="5+ BHK">5+ BHK</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 text-left pt-1">
                <label className="text-[13px] font-bold text-[#1a1b36]">When do you want to start? *</label>
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-5 mt-1">
                  <label className="flex items-center space-x-2 text-[13px] text-gray-600 cursor-pointer">
                    <input type="radio" required name="time" value="Immediately" className="text-[#cc0000] focus:ring-[#cc0000]" />
                    <span>Immediately</span>
                  </label>
                  <label className="flex items-center space-x-2 text-[13px] text-gray-600 cursor-pointer">
                    <input type="radio" required name="time" value="Within 1 Month" className="text-[#cc0000] focus:ring-[#cc0000]" />
                    <span>Within 1 Month</span>
                  </label>
                  <label className="flex items-center space-x-2 text-[13px] text-gray-600 cursor-pointer">
                    <input type="radio" required name="time" value="Within 3 Months" className="text-[#cc0000] focus:ring-[#cc0000]" />
                    <span>Within 3 Months</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1 text-left pt-1">
                <label className="text-[13px] font-bold text-[#1a1b36]">Requirement*</label>
                <textarea required name="requirement" rows={3} className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] outline-none transition-colors resize-none text-[14px]"></textarea>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-[#cc0000] hover:bg-[#aa0000] text-white font-bold text-[14px] py-3.5 rounded-full shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
              >
                BOOK A CONSULTATION
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
