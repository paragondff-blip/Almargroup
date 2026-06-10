import { useState } from "react";
import { Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("almar_admin_token", data.token);
        navigate("/admin");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-4xl italic mb-4">A</div>
          <h1 className="text-2xl font-black tracking-tighter uppercase text-primary">Almar<span className="text-secondary">Group</span></h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Admin Portal</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Admin ID</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="e.g. almar"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-lg font-bold uppercase tracking-widest text-[11px] shadow-lg flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 disabled:opacity-70 mt-4"
          >
            {isLoading ? "Authenticating..." : <>Access Portal <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
}
