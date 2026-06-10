import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, CheckCircle, X } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: string;
}

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: "", code: "", discount: 0, type: "percentage" });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const res = await fetch("/api/coupons");
    const data = await res.json();
    setCoupons(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `/api/coupons/${formData.id}` : "/api/coupons";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    
    setIsModalOpen(false);
    fetchCoupons();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    fetchCoupons();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-primary uppercase tracking-tighter">Coupon Management</h1>
        <button onClick={() => { setIsEdit(false); setFormData({ id: "", code: "", discount: 0, type: "percentage" }); setIsModalOpen(true); }} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
           <Plus className="h-4 w-4" /> Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
           <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-widest bg-gray-50">
                 <th className="p-4 font-bold">Code</th>
                 <th className="p-4 font-bold">Discount</th>
                 <th className="p-4 font-bold">Type</th>
                 <th className="p-4 font-bold text-center">Actions</th>
              </tr>
           </thead>
           <tbody className="text-sm">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                   <td className="p-4 font-bold text-primary">{coupon.code}</td>
                   <td className="p-4">{coupon.discount}</td>
                   <td className="p-4 uppercase">{coupon.type}</td>
                   <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => { setIsEdit(true); setFormData(coupon); setIsModalOpen(true); }} className="text-secondary hover:text-primary transition-colors"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(coupon.id)} className="text-red-500 hover:text-red-700 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h2 className="text-lg font-black text-primary uppercase tracking-tighter mb-4">{isEdit ? "Edit Coupon" : "Add New Coupon"}</h2>
            <div>
               <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Coupon Code</label>
               <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
               <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Discount Value</label>
               <input required type="number" value={formData.discount} onChange={e => setFormData({...formData, discount: parseInt(e.target.value)})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
               <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Type</label>
               <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary uppercase">
                 <option value="percentage">Percentage</option>
                 <option value="flat">Flat</option>
               </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-widest rounded-lg">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
