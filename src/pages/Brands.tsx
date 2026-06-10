import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface Brand {
  id: string;
  name: string;
  logo: string;
  status: string;
}

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/brands")
      .then(res => res.json())
      .then(data => {
        setBrands(data.filter((b: Brand) => b.status === "Active"));
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-24 pb-20 bg-accent min-h-screen">
       {/* Header */}
       <div className="bg-primary text-white py-16 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase">Our Premium Brands</h1>
             <p className="text-blue-100 max-w-2xl mx-auto text-lg">
               Explore our diverse portfolio of world-class brands.
             </p>
          </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Brands Grid */}
          {loading ? (
            <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">Loading brands...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {brands.map((brand, i) => (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   key={brand.id} 
                   className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100 flex flex-col items-center justify-center p-8 aspect-square"
                 >
                    <div className="w-32 h-32 mb-6 transition-transform duration-500 group-hover:scale-110">
                       <img 
                         src={brand.logo} 
                         alt={brand.name} 
                         className="w-full h-full object-contain"
                       />
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase text-center">{brand.name}</h3>
                 </motion.div>
               ))}
            </div>
          )}
       </div>
    </div>
  );
}
