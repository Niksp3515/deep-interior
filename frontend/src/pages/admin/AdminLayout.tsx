import { Outlet, Navigate, useNavigate, Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { checkAuthStatus, adminLogout } from "@/lib/api";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!localStorage.getItem("adminInfo")) {
        setIsAuthenticated(false);
        return;
      }
      try {
        await checkAuthStatus();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem("adminInfo");
      }
    };
    
    verifyAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch(err) {
      console.error(err);
    } finally {
      localStorage.removeItem("adminInfo");
      navigate("/admin/login");
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-muted-foreground text-sm">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="font-display tracking-display text-xl text-primary">Deep Interior</h1>
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <Link 
                to="/admin" 
                className={`transition-colors ${window.location.pathname === '/admin' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Projects
              </Link>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
