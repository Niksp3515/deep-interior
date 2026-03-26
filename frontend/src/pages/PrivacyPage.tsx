import SEO from "@/components/SEO";

export default function PrivacyPage() {
  return (
    <main id="main-content" className="pt-32 pb-24 bg-background min-h-screen">
      <SEO 
        title="Privacy Policy | Deep Interior" 
        description="Privacy policy for Deep Interior Ahmedabad. We respect your data and privacy." 
      />
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-display text-foreground mb-8">Privacy Policy</h1>
        <div className="prose prose-zinc prose-a:text-primary dark:prose-invert max-w-none text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Introduction</h2>
          <p>Deep Interior ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights.</p>
          
          <h2>2. The Data We Collect About You</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul>
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes email address and telephone numbers submitted via our contact forms.</li>
            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website (collected via Google Analytics).</li>
            <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
          </ul>

          <h2>3. How We Use Your Personal Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., providing interior design or turnkey renovation services).</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>

          <h2>4. Cookies</h2>
          <p>You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly. We use Google Analytics utilizing cookies to track website usage and traffic.</p>

          <h2>5. Contact Details</h2>
          <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us at:</p>
          <p>Email address: deepinterior74@gmail.com<br/>Telephone number: +91 98796 24474</p>
        </div>
      </div>
    </main>
  );
}
