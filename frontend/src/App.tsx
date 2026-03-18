import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { useSecurityOptions } from "./hooks/useSecurityOptions";

const HomePage = lazy(() => import("./pages/HomePage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProjectEdit = lazy(() => import("./pages/admin/AdminProjectEdit"));

const GlobalLoader = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center">
    <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
    <p className="text-sm text-muted-foreground animate-pulse">Loading Deep Interior...</p>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  useSecurityOptions();

  return (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={<GlobalLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="project/:id" element={<AdminProjectEdit />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
  );
};

export default App;
