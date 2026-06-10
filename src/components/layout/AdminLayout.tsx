import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { CopyPlus, Settings, LayoutDashboard, Search, Home as HomeIcon, CreditCard, Users, Box, List as ListIcon, Building2, LogOut, Percent } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("almar_admin_token");
    if (!token) {
      navigate("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("almar_admin_token");
    navigate("/admin/login");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-accent font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
             <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-primary font-bold italic">A</div>
             <span className="font-black text-xl uppercase tracking-tighter">Almar<span className="text-secondary">Admin</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
           <Link to="/admin" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors ${location.pathname === '/admin' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-blue-100'}`}><LayoutDashboard className="h-4 w-4"/> Dashboard</Link>
           <Link to="/admin/orders" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors ${location.pathname.includes('/orders') ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-blue-100'}`}><CreditCard className="h-4 w-4"/> Orders</Link>
           <Link to="/admin/products" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors ${location.pathname.includes('/products') ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-blue-100'}`}><Box className="h-4 w-4"/> Products</Link>
           <Link to="/admin/brands" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors ${location.pathname.includes('/brands') ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-blue-100'}`}><ListIcon className="h-4 w-4"/> Brands</Link>
           <Link to="/admin/activities" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors ${location.pathname.includes('/activities') ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-blue-100'}`}><CopyPlus className="h-4 w-4"/> Activities</Link>
           <Link to="/admin/news" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors ${location.pathname.includes('/news') ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-blue-100'}`}><LayoutDashboard className="h-4 w-4"/> News</Link>
           <Link to="/admin/careers" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors ${location.pathname.includes('/careers') ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-blue-100'}`}><Users className="h-4 w-4"/> Careers</Link>
           <Link to="/admin/coupons" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors ${location.pathname.includes('/coupons') ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-blue-100'}`}><Percent className="h-4 w-4"/> Coupons</Link>
           <Link to="/admin/footer" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors ${location.pathname.includes('/footer') ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-blue-100'}`}><Settings className="h-4 w-4"/> Footer</Link>
        </nav>
        
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-blue-100 font-bold uppercase tracking-widest text-[10px] transition-colors"><HomeIcon className="h-4 w-4"/> Back to Site</Link>
          <Link to="/admin/settings" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors ${location.pathname === '/admin/settings' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-blue-100'}`}><Settings className="h-4 w-4"/> Settings (CMS)</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
         {/* Admin Header */}
         <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10 shadow-sm">
           <h1 className="text-xl font-black text-primary uppercase tracking-tighter">Admin Portal</h1>
           <div className="flex items-center gap-6">
              <div className="relative">
                 <input type="text" placeholder="SEARCH PORTAL..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-[10px] font-bold uppercase tracking-widest w-64" />
                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                   AD
                </div>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
           </div>
         </header>
         
         <div className="flex-1 overflow-auto p-8">
            <Outlet />
         </div>
      </main>
    </div>
  );
}
