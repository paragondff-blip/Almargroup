import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, Building2, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { useCart } from "../../context/CartContext";
import CartDrawer from "../cart/CartDrawer";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const location = useLocation();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  const navLinks = settings?.navLinks || [
    { name: "Home", path: "/" },
    { name: "Our Brands", path: "/brands" },
    { name: "Activities", path: "/activities" },
    { name: "News & Events", path: "/news" },
    { name: "Shop", path: "/shop" },
    { name: "Career", path: "/career" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-white py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            {settings?.mainLogo ? (
               <>
                 <img src={settings.mainLogo} alt="Logo" className="w-auto h-10 object-contain" />
                 <span className="text-2xl font-black tracking-tighter uppercase text-primary">{settings.corpTitle ? settings.corpTitle.split(' ')[0] : 'Almar'}<span className="text-secondary">{settings.corpTitle ? settings.corpTitle.split(' ').slice(1).join(' ') : 'Group'}</span></span>
               </>
            ) : (
               <>
                 <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-2xl italic">A</div>
                 <span className="text-2xl font-black tracking-tighter uppercase text-primary">Almar<span className="text-secondary">Group</span></span>
               </>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm hover:text-secondary transition-colors",
                  location.pathname === link.path ? "font-bold border-b-2 border-primary text-gray-900" : "font-medium text-gray-700"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="relative flex items-center">
              {isSearchOpen && (
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="mr-2 pl-3 pr-8 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 w-48"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      window.location.href = `/shop?search=${e.currentTarget.value}`;
                    }
                  }}
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              )}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute 0 top-0 right-0 h-4 w-4 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile Menu Toggle & Cart */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-gray-700 relative"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-700 font-medium hover:text-secondary p-2 rounded-md hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="relative mt-2">
             <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        window.location.href = `/shop?search=${e.currentTarget.value}`;
                    }
                }}
             />
             <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
