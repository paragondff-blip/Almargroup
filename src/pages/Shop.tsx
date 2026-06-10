import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Star, ArrowRight, Zap } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { Product } from "../types";

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBrand, setActiveBrand] = useState("All");

  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("search") || "";

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleOrderNow = (product: Product) => {
    addToCart(product);
    navigate("/checkout");
  };

  useEffect(() => {
    const url = searchTerm ? `/api/products/search?q=${searchTerm}` : "/api/products";
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, [searchTerm]);

  const brands = ["All", "Almar Home", "Almar Workspace", "Almar Lifestyle", "Almar Tech"];

  const filteredProducts = activeBrand === "All" 
    ? products 
    : products.filter(p => p.brand === activeBrand);

  return (
    <div className="pt-24 pb-20 bg-accent min-h-screen">
       {/* Header */}
       <div className="bg-primary text-white py-16 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase">Shop ALMAR</h1>
             <p className="text-blue-100 max-w-2xl mx-auto text-lg">
               Explore our diverse portfolio of world-class products designed for excellence.
             </p>
          </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Brand Filter */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
             {brands.map(brand => (
               <button
                 key={brand}
                 onClick={() => setActiveBrand(brand)}
                 className={`px-6 py-3 rounded-full font-bold transition-all uppercase tracking-widest text-xs ${
                   activeBrand === brand 
                    ? "bg-secondary text-white shadow-lg" 
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                 }`}
               >
                 {brand}
               </button>
             ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
               {filteredProducts.map((product, i) => (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   key={product.id} 
                   className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group group/card border border-gray-100 flex flex-col"
                 >
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                       <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full z-10 ${product.stock > 0 ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                          {product.stock > 0 ? "In Stock" : "Stock Out"}
                        </div>
                        {product.isDiscount && (
                         <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                           -{Math.round((1 - (product.discountPrice! / product.price)) * 100)}%
                         </div>
                       )}
                       <img 
                         src={product.image} 
                         alt={product.name} 
                         className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                       />
                       
                       {/* Quick Actions overlay */}
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button 
                            onClick={() => handleAddToCart(product)}
                            className="bg-white text-primary p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                          >
                            <ShoppingCart className="h-5 w-5" />
                          </button>
                       </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                       <div className="text-[10px] text-secondary font-black uppercase tracking-widest mb-2">{product.brand}</div>
                       <h3 className="text-lg font-black text-gray-900 mb-2 truncate">{product.name}</h3>
                       
                       <div className="flex items-center gap-1 mb-4">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
                       </div>

                       <div className="mt-auto">
                         <div className="flex items-end gap-3 mb-4">
                            {product.isDiscount ? (
                              <>
                                <span className="text-2xl font-black text-primary">৳{product.discountPrice}</span>
                                <span className="text-sm text-gray-400 line-through mb-1 font-bold">৳{product.price}</span>
                              </>
                            ) : (
                               <span className="text-2xl font-black text-primary">৳{product.price}</span>
                            )}
                         </div>
                         
                         <div className="flex gap-2">
                           <button 
                             onClick={() => handleAddToCart(product)}
                             disabled={product.stock === 0}
                              className={`flex-1 bg-white hover:bg-gray-50 text-primary border-2 border-primary py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                           >
                              <ShoppingCart className="h-4 w-4" /> Add
                           </button>
                           <button 
                             onClick={() => handleOrderNow(product)}
                             disabled={product.stock === 0}
                              className={`flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] shadow-lg hover:-translate-y-0.5 ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                           >
                              <Zap className="h-4 w-4" /> Order Now
                           </button>
                         </div>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
          )}
       </div>
    </div>
  );
}
