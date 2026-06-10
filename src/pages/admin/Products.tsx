import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { Product } from "../../types";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    discountPrice: "",
    isDiscount: false,
    category: "",
    image: "",
    stock: "0",
  });

  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  };

  const fetchBrands = async () => {
    const res = await fetch("/api/brands");
    setBrands(await res.json());
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        brand: product.brand,
        price: product.price.toString(),
        discountPrice: product.discountPrice?.toString() || "",
        isDiscount: product.isDiscount,
        category: product.category,
        image: product.image,
        stock: product.stock.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: "", brand: "", price: "", discountPrice: "", isDiscount: false, category: "", image: "", stock: "0" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
    const method = editingProduct ? "PUT" : "POST";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.isDiscount ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock),
        rating: 5.0
      }),
    });
    
    setIsModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
         <div>
           <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Product Catalog</h2>
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage e-commerce products and inventory</p>
         </div>
         <button onClick={() => handleOpenModal()} className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-[10px] shadow-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5">
           <Plus className="h-4 w-4" /> Add Product
         </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
           <div className="relative">
              <input type="text" placeholder="SEARCH PRODUCTS..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 w-64" />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-widest bg-gray-50/50">
                  <th className="p-4 font-bold">Product Name</th>
                  <th className="p-4 font-bold">Brand</th>
                  <th className="p-4 font-bold">Price</th>
                  <th className="p-4 font-bold">Stock</th>
                  <th className="p-4 font-bold text-right">Actions</th>
               </tr>
            </thead>
            <tbody>
               {products.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="p-12 text-center text-gray-500 font-medium">
                      No products found. Add one above.
                   </td>
                 </tr>
               ) : products.map(product => (
                 <tr key={product.id} className="border-b border-gray-100/50 hover:bg-gray-50/50">
                   <td className="p-4 font-bold text-sm flex-1">
                     <span className="flex items-center gap-3">
                       {product.image && <img src={product.image} alt={product.name} className="w-8 h-8 rounded object-cover" />}
                       {product.name}
                     </span>
                   </td>
                   <td className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">{product.brand}</td>
                   <td className="p-4 text-sm font-bold text-primary">
                    <div className="flex items-center gap-2">
                      {product.isDiscount && product.discountPrice ? (
                        <>
                          <span className="text-gray-400 line-through text-xs">৳{product.price}</span>
                          <span>৳{product.discountPrice}</span>
                        </>
                      ) : (
                        <span>৳{product.price}</span>
                      )}
                    </div>
                   </td>
                   <td className={`p-4 text-xs font-bold px-2 py-1 inline-block mt-2 rounded ${product.stock > 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>{product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}</td>
                   <td className="p-4 text-right">
                     <button onClick={() => handleOpenModal(product)} className="text-gray-400 hover:text-primary transition-colors p-1"><Edit className="h-4 w-4" /></button>
                     <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-black text-primary uppercase tracking-tighter mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Brand</label>
                  <select required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary">
                    <option value="">Select a Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.name}>{brand.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Price</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Discount Price</label>
                  <input type="number" step="0.01" value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Stock Quantity</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isDiscount} onChange={e => setFormData({...formData, isDiscount: e.target.checked})} className="rounded border-gray-200 text-primary focus:ring-primary" />
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Apply Discount</label>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Image source (Upload or URL) - <span className="text-secondary normal-case tracking-normal">Optimal: 800x800px, Max: 500KB</span></label>
                <div className="flex gap-2">
                   <div className="flex-1 relative">
                     <input required type="text" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary" />
                   </div>
                   <label className="bg-gray-100 border border-gray-200 text-gray-700 px-3 py-2 rounded font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:bg-gray-200 flex items-center justify-center whitespace-nowrap">
                     Upload
                     <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                       const file = e.target.files?.[0];
                       if (file) {
                         const reader = new FileReader();
                         reader.onloadend = () => setFormData({...formData, image: String(reader.result)});
                         reader.readAsDataURL(file);
                       }
                     }} />
                   </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px]">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
