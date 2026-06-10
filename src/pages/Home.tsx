import { ArrowRight, BarChart3, Globe2, Users, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";
import { useEffect, useState, useRef } from "react";
import ImageScrollingStrip from "../components/ImageScrollingStrip";

function AnimatedCounter({ value, suffix }: { value: number, suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  const heroCover = settings?.heroCover || "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  const title1 = settings?.heroTitle?.split(' ')[0] || "Welcome to";
  const title2 = settings?.heroTitle?.split(' ').slice(1).join(' ') || "Almar Group";
  const subtitle = settings?.heroSubtitle || "Empowering global growth through innovative solutions and enterprise management across multifaceted industries.";
  const stats = settings?.stats || [];
  const aboutTitle = settings?.aboutTitle || "SHAPING THE FUTURE OF GLOBAL COMMERCE";
  const aboutDesc = settings?.aboutDesc || "A diversified conglomerate committed to excellence, innovation, and sustainable growth across multiple industries.";
  const corpTitle = settings?.corpTitle || "Shaping the Future of Global Enterprise";
  const corpDesc = settings?.corpDesc || "At Almar Group, we vision a future where enterprise solutions drive sustainable growth. With over two decades of excellence, we have built an ecosystem of brands that deliver unparalleled value to our consumers worldwide.";
  const mission = settings?.mission || "To innovate and lead across major industries while maintaining the highest standards of corporate responsibility.";
  const vision = settings?.vision || "Becoming the most trusted multinational conglomerate, driving prosperity in every community we touch.";
  const corpImage = settings?.corpImage || "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
  const corpProfileTag = settings?.corpProfileTag || "Corporate Profile";
  const globalTeamLabel = settings?.globalTeamLabel || "Global Team";
  const globalTeamSublabel = settings?.globalTeamSublabel || "10,000+ experts";
  const globalTeamAvatars = settings?.globalTeamAvatars || [
    "https://i.pravatar.cc/100?img=12",
    "https://i.pravatar.cc/100?img=24",
    "https://i.pravatar.cc/100?img=36",
    "https://i.pravatar.cc/100?img=48"
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroCover}
            alt="Corporate Building" 
            className="w-full h-full object-cover scale-105" 
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-90"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tighter"
          >
            {title1} <br/> <span className="text-secondary">{title2}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/about" className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-md font-bold transition-all flex items-center gap-2 uppercase tracking-widest text-xs shadow-lg">
               Discover Our Story <ArrowRight className="h-4 w-4"/>
            </Link>
            <Link to="/brands" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-md font-bold transition-all uppercase tracking-widest text-xs">
               Explore Brands
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="p-8 rounded-2xl bg-white border border-gray-100 flex flex-col items-center text-center shadow-xl hover:-translate-y-1 transition-transform"
                >
                  {i === 0 && <BarChart3 className="h-8 w-8 text-secondary mb-4"/>}
                  {i === 1 && <Users className="h-8 w-8 text-secondary mb-4"/>}
                  {i === 2 && <Globe2 className="h-8 w-8 text-secondary mb-4"/>}
                  {i === 3 && <ArrowUpRight className="h-8 w-8 text-secondary mb-4"/>}
                  <h3 className="text-4xl font-black text-primary mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </h3>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter italic">{stat.label}</p>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tighter uppercase mb-6">
               {aboutTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
               {aboutDesc}
            </p>
         </div>
         <ImageScrollingStrip />
      </section>

      <section className="py-24 bg-accent">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               <div className="lg:w-1/2">
                  <span className="text-secondary font-black tracking-widest uppercase text-[10px] italic">{corpProfileTag}</span>
                  <h2 className="text-4xl md:text-5xl font-black text-primary mt-4 mb-6 leading-[1.1] tracking-tighter">{corpTitle}</h2>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                     {corpDesc}
                  </p>
                  
                  <div className="space-y-6 mb-10">
                     <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                           <div className="h-6 w-6 rounded-full bg-primary"></div>
                        </div>
                        <div>
                           <h4 className="text-xl font-bold text-primary mb-2">Our Mission</h4>
                           <p className="text-gray-600">{mission}</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                           <div className="h-6 w-6 rounded-full bg-secondary"></div>
                        </div>
                        <div>
                           <h4 className="text-xl font-bold text-primary mb-2">Our Vision</h4>
                           <p className="text-gray-600">{vision}</p>
                        </div>
                     </div>
                  </div>

                  <Link to="/about" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary transition-colors">
                     Learn more about us <ArrowRight className="h-5 w-5"/>
                  </Link>
               </div>
               
               <div className="lg:w-1/2 relative">
                  <div className="absolute inset-0 bg-primary rounded-3xl translate-x-4 translate-y-4 opacity-10"></div>
                  <img 
                    src={corpImage} 
                    alt="Corporate meeting" 
                    className="relative z-10 rounded-3xl shadow-xl w-full object-cover h-[600px]"
                  />
                  
                  <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20 max-w-sm glassmorphism">
                     <div className="flex items-center gap-4 mb-2">
                        <div className="flex -space-x-3">
                           {globalTeamAvatars.map((src: string, index: number) => (
                             <img key={index} src={src || `https://i.pravatar.cc/100?img=${index + 12}`} className="w-10 h-10 rounded-full border-2 border-white object-cover" referrerPolicy="no-referrer"/>
                           ))}
                        </div>
                        <div>
                           <div className="font-bold text-primary">{globalTeamLabel}</div>
                           <div className="text-sm text-gray-500">{globalTeamSublabel}</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
