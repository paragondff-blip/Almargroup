import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  CopyPlus, Settings, LayoutDashboard, Search, Home as HomeIcon, 
  CreditCard, Users, Box, List as ListIcon, LogOut, Percent, 
  Bell, Mail, Phone, Calendar, ArrowRight, Inbox 
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";

interface Inquiry {
  id: string;
  name: string;
  address: string;
  mobile: string;
  email?: string | null;
  description: string;
  attachmentName?: string | null;
  attachmentData?: string | null;
  read: boolean;
  createdAt: string;
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contacts, setContacts] = useState<Inquiry[]>([]);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts");
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      console.error("Error fetching contacts in layout:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("almar_admin_token");
    if (!token) {
      navigate("/admin/login");
    } else {
      setIsAuthenticated(true);
    }

    fetchContacts();
    // Poll contacts every 10 seconds for real-time alerts
    const interval = setInterval(fetchContacts, 10000);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("almar_admin_token");
    navigate("/admin/login");
  };

  if (!isAuthenticated) return null;

  const unreadCount = contacts.filter((c) => !c.read).length;
  const topNotifications = contacts.slice(0, 5); // Show latest 5

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateStr;
    }
  };

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
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
           <Link to="/admin" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors ${location.pathname === '/admin' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-blue-100'}`}><LayoutDashboard className="h-4 w-4"/> Dashboard</Link>
           <Link to="/admin/orders" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors ${location.pathname.includes('/orders') ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-blue-100'}`}><CreditCard className="h-4 w-4"/> Orders</Link>
           <Link to="/admin/inquiries" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors ${location.pathname.includes('/inquiries') ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-blue-100'}`}>
              <Mail className="h-4 w-4"/> Inquiries 
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black animate-pulse">
                  {unreadCount}
                </span>
              )}
           </Link>
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
         <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10 shadow-sm col-span-12">
           <h1 className="text-xl font-black text-primary uppercase tracking-tighter">Admin Portal</h1>
           
           <div className="flex items-center gap-6">
              <div className="relative hidden lg:block">
                 <input type="text" placeholder="SEARCH PORTAL..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-[10px] font-bold uppercase tracking-widest w-64" />
                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              {/* Real-time Notification Bell dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsBellOpen(!isBellOpen)}
                  className="relative p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-all focus:outline-none active:scale-95"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isBellOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-gray-100 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="p-4 bg-gray-50/50 flex justify-between items-center">
                      <span className="text-xs font-black text-primary uppercase tracking-wider">Onsite Notifications</span>
                      {unreadCount > 0 && (
                        <span className="bg-red-100 text-red-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                          {unreadCount} Unread
                        </span>
                      )}
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      {contacts.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">
                          <Inbox className="h-8 w-8 mx-auto mb-2 text-gray-300 animate-pulse" />
                          <p className="text-xs font-medium">No inquiries received yet.</p>
                        </div>
                      ) : (
                        topNotifications.map((notif) => (
                          <Link 
                            key={notif.id}
                            to="/admin/inquiries"
                            onClick={() => setIsBellOpen(false)}
                            className={`block p-4 hover:bg-gray-50 transition-colors ${!notif.read ? "bg-blue-50/20" : ""}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className={`text-xs truncate max-w-[150px] ${!notif.read ? "font-black text-gray-900" : "font-semibold text-gray-700"}`}>
                                {notif.name}
                              </span>
                              <span className="text-[9px] text-gray-400 font-bold">
                                {formatDate(notif.createdAt)}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 line-clamp-1 leading-relaxed">
                              {notif.description}
                            </p>
                          </Link>
                        ))
                      )}
                    </div>

                    <Link 
                      to="/admin/inquiries"
                      onClick={() => setIsBellOpen(false)}
                      className="block p-3.5 text-center text-[10px] font-black text-secondary hover:bg-secondary/5 transition-colors uppercase tracking-widest flex items-center justify-center gap-1.5"
                    >
                      View All Inquiries <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
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
