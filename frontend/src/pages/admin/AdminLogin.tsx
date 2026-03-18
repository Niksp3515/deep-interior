import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "@/lib/api";
import { toast } from "sonner";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await adminLogin({ username, password });
      // Token is now stored securely in HttpOnly cookie. Just storing username info.
      localStorage.setItem("adminInfo", JSON.stringify({
        _id: data._id,
        username: data.username
      }));
      toast.success("Login successful");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 flex justify-center bg-background">
      <div className="w-full max-w-md p-8 border rounded-2xl bg-card">
        <h1 className="font-display text-3xl mb-8 text-center">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl border bg-background"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border bg-background"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-70 transition-brand"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
