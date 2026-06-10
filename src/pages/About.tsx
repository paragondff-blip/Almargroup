import React, { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

export default function About() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  const companyName = settings?.companyName || "Almar Group";
  const aboutImage = settings?.aboutImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const aboutTitle = settings?.aboutTitle || "Our Legacy of Excellence";
  const aboutDesc = settings?.aboutDesc || "Founded over two decades ago, we have grown into a dynamic corporate ecosystem. With a robust portfolio of premium brands, we strive to provide unparalleled value in everything we do.";

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header content */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 uppercase tracking-tighter">About {companyName}</h1>
          <p className="text-gray-600 text-lg">
            We are a multinational conglomerate dedicated to empowering global growth through strategic enterprise management and innovation.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-black text-primary mb-6 tracking-tighter">{aboutTitle}</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {aboutDesc}
            </p>
            <ul className="space-y-4">
               {[
                 "Industry-leading standards",
                 "A commitment to global sustainability",
                 "Innovative technology processing",
                 "10,000+ top-tier professionals"
               ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                     <CheckCircle2 className="h-6 w-6 text-secondary shrink-0" />
                     <span className="text-gray-700 font-medium">{item}</span>
                  </li>
               ))}
            </ul>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-secondary rounded-3xl -rotate-3 opacity-10"></div>
             <img 
               src={aboutImage} 
               alt="Corporate Team" 
               className="relative z-10 rounded-3xl shadow-xl w-full"
             />
          </div>
        </div>

      </div>
    </div>
  );
}
