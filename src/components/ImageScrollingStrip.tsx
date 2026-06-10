import { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function ImageScrollingStrip() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.scrollingImages) {
          setImages(data.scrollingImages);
        }
      });
  }, []);

  if (images.length === 0) return null;

  return (
    <div className="w-full overflow-hidden py-10 bg-white">
      <motion.div 
        className="flex gap-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          ease: "linear", 
          duration: 30, 
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        {[...images, ...images].map((src, i) => (
          <div key={i} className="flex-shrink-0 w-80 h-64">
            <img src={src} alt="Gallery" className="w-full h-full object-cover rounded-2xl shadow-lg" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
