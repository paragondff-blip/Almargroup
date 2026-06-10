import { useState, useEffect } from "react";
import { motion } from "motion/react";
import type { NewsItem } from "../types";

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/api/news")
      .then(res => res.json())
      .then(data => setNews(data));
  }, []);

  return (
    <div className="pt-24 pb-20 bg-accent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 uppercase tracking-tighter">News & Events</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Stay updated with the latest announcements, press releases, and corporate events from Almar Group.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, i) => (
             <motion.article 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               key={item.id} 
               className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col"
             >
               <img src={item.image} alt={item.title} className="h-56 w-full object-cover" />
               <div className="p-6 flex-1 flex flex-col">
                  <span className="text-[10px] text-secondary font-black uppercase tracking-widest mb-3 block">{item.date}</span>
                  <h3 className="text-xl font-black text-primary mb-3 leading-snug tracking-tighter">{item.title}</h3>
                  <p className="text-gray-600 mb-6 flex-1">{item.description}</p>
                  <button className="text-[10px] text-primary font-black uppercase tracking-widest hover:text-secondary transition-colors text-left mt-auto">
                    Read More &rarr;
                  </button>
               </div>
             </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
