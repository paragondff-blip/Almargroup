import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, ArrowRight } from "lucide-react";
import type { NewsItem } from "../types";

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

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
               className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col cursor-pointer"
               onClick={() => setSelectedNews(item)}
             >
               <img src={item.image} alt={item.title} className="h-56 w-full object-cover" />
               <div className="p-6 flex-1 flex flex-col">
                  <span className="text-[10px] text-secondary font-black uppercase tracking-widest mb-3 block flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> {item.date}
                  </span>
                  <h3 className="text-xl font-black text-primary mb-3 leading-snug tracking-tighter">{item.title}</h3>
                  <p className="text-gray-600 mb-6 flex-1 line-clamp-3">{item.description}</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNews(item);
                    }} 
                    className="text-[10px] text-primary font-black uppercase tracking-widest hover:text-secondary transition-colors text-left mt-auto flex items-center gap-1"
                  >
                    Read More <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </button>
               </div>
             </motion.article>
          ))}
        </div>
      </div>

      {/* Elegant News Details Modal */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNews(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              id="news-modal-backdrop"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl z-10 border border-gray-100"
              id="news-modal-card"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2.5 z-20 transition-all shadow-md focus:outline-none"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Cover Image */}
              <div className="relative h-64 md:h-80 w-full overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
                <img 
                  src={selectedNews.image} 
                  alt={selectedNews.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-secondary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1 shadow-sm mb-3">
                    <Calendar className="h-2.5 w-2.5" /> {selectedNews.date}
                  </span>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight uppercase">
                    {selectedNews.title}
                  </h2>
                </div>
              </div>

              {/* Scrollable Core Content */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1 font-sans">
                <div className="prose max-w-none">
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                    {selectedNews.description}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex justify-end gap-3 shrink-0">
                <button
                  onClick={() => setSelectedNews(null)}
                  className="bg-primary hover:bg-primary/95 text-white px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
