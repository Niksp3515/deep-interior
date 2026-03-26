import SEO from "@/components/SEO";

export default function TermsPage() {
  return (
    <main id="main-content" className="pt-32 pb-24 bg-background min-h-screen">
      <SEO 
        title="Terms of Service | Deep Interior" 
        description="Terms of service and liability limits for Deep Interior." 
      />
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-display text-foreground mb-8">Terms of Service</h1>
        <div className="prose prose-zinc prose-a:text-primary dark:prose-invert max-w-none text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Agreement to Terms</h2>
          <p>By accessing our website and utilizing our interior design or turnkey architectural services, you agree to be bound by these Terms of Service and all applicable laws and regulations in Ahmedabad, Gujarat, India. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
          
          <h2>2. Services Provided</h2>
          <p>Deep Interior provides custom furniture manufacturing, spatial planning, and interior design / architectural services. All 3D designs, blueprints, and proposals provided are intellectual property of Deep Interior until full payment is finalized as per an explicit written agreement.</p>

          <h2>3. Limitations of Liability</h2>
          <p>In no event shall Deep Interior or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Deep Interior's website, even if Deep Interior or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
          <p>For interior design execution and turnkey projects, liability is strictly limited to the scope of work and materials defined in the signed contract. We are not liable for delays caused by third-party vendors or unforeseen structural issues discovered during renovation.</p>

          <h2>4. Accuracy of Materials</h2>
          <p>The materials appearing on Deep Interior's website (including design proposals and portfolio images) could include technical, typographical, or photographic errors. Deep Interior does not warrant that any of the materials on its website are accurate, complete or current. Deep Interior may make changes to the materials contained on its website at any time without notice.</p>

          <h2>5. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of Gujarat, India, and you irrevocably submit to the exclusive jurisdiction of the courts in Ahmedabad.</p>
        </div>
      </div>
    </main>
  );
}
