import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShow(true);
    } else if (consent === 'accepted') {
      loadGA4();
    }
  }, []);

  const loadGA4 = () => {
    if ((window as any).dataLayer) return; // Prevent multiple loads
    
    // Attempt dynamic fetch or fallback safely without crashing
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'; 

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(inlineScript);
  };

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShow(false);
    loadGA4();
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[400px] z-[100] p-6 bg-card border border-border rounded-2xl shadow-2xl flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-foreground text-lg">We value your privacy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use cookies to enhance your browsing experience and analyze our traffic. 
              By clicking "Accept", you consent to our use of cookies and Google Analytics tracking.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full justify-end mt-2">
            <button 
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium rounded-xl text-muted-foreground hover:bg-secondary transition-colors"
            >
              Decline
            </button>
            <button 
              onClick={handleAccept}
              className="px-6 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-brand shadow-sm"
            >
              Accept All
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
