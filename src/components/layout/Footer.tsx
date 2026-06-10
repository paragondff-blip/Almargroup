import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Building2, Mail, Phone, MapPin, Facebook, Linkedin, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const [footer, setFooter] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/footer")
      .then(res => res.json())
      .then(data => setFooter(data));
      
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  if (!footer || !settings) return null;

  const getIcon = (name: string) => {
    switch (name) {
        case "MapPin": return <MapPin className="h-5 w-5 text-secondary flex-shrink-0" />;
        case "Phone": return <Phone className="h-5 w-5 text-secondary flex-shrink-0" />;
        case "Mail": return <Mail className="h-5 w-5 text-secondary flex-shrink-0" />;
        default: return null;
    }
  }

  const getSocialIcon = (name: string) => {
    switch (name) {
        case "Facebook": return <Facebook className="h-5 w-5" />;
        case "Linkedin": return <Linkedin className="h-5 w-5" />;
        case "Twitter": return <Twitter className="h-5 w-5" />;
        case "Instagram": return <Instagram className="h-5 w-5" />;
        case "Youtube": return <Youtube className="h-5 w-5" />;
        default: return null;
    }
  }

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              {(() => {
                const companyNameStr = settings?.companyName || "Almar Group";
                const firstWord = companyNameStr.split(' ')[0];
                const remainingWords = companyNameStr.split(' ').slice(1).join(' ');
                return settings?.mainLogo ? (
                  <>
                    <img src={settings.mainLogo} alt="Logo" className="w-auto h-10 object-contain bg-white rounded p-1" />
                    <span className="text-2xl font-black tracking-tighter uppercase text-white">
                      {firstWord}
                      {remainingWords && <span className="text-secondary"> {remainingWords}</span>}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary font-bold text-2xl italic">{firstWord ? firstWord[0] : 'A'}</div>
                    <span className="text-2xl font-black tracking-tighter uppercase text-white">
                      {firstWord}
                      {remainingWords && <span className="text-secondary"> {remainingWords}</span>}
                    </span>
                  </>
                );
              })()}
            </Link>
            <p className="text-blue-100 mb-6 max-w-sm">
              {footer.aboutText}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-4 italic">Contact Info</h4>
            <ul className="space-y-3 text-blue-100">
              {footer.contactInfo.map((info: any) => (
                  <li key={info.id} className="flex items-center gap-3">
                    {getIcon(info.icon)}
                    <span>{info.text}</span>
                  </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-4 italic">Policies</h4>
            <ul className="space-y-2 text-blue-100">
                {footer.policies.map((p: any) => (
                    <li key={p.id}><Link to={p.path} className="hover:text-white transition-colors">{p.name}</Link></li>
                ))}
            </ul>
          </div>

          <div>
             <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-4 italic">Follow Us</h4>
             <div className="flex flex-wrap gap-4">
                {footer.socialLinks.map((s: any) => (
                    <a key={s.id} href={s.href} className="bg-white/10 p-2 rounded-full hover:bg-secondary transition-all">{getSocialIcon(s.name)}</a>
                ))}
             </div>
             <div className="mt-8">
               <Link to="/admin" className="text-secondary text-sm font-medium hover:text-white transition-colors">Admin Login</Link>
               <br />
               <Link to="/track-order" className="text-secondary text-sm font-medium hover:text-white transition-colors">Track Order</Link>
             </div>
          </div>

        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-8 text-[10px] font-bold uppercase tracking-wider text-white/60">
            {footer.policies.slice(0, 3).map((p: any) => (
                <Link key={p.id} to={p.path} className="hover:text-white">{p.name}</Link>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider text-center">Payment Gateways Enabled</span>
              </div>
             <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider italic">© {new Date().getFullYear()} {settings?.companyName || "Almar Group"}. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
