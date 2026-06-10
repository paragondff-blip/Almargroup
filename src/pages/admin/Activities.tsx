import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Activity {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  image: string;
}

export default function AdminActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Sales & Marketing",
    date: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const res = await fetch("/api/activities");
    setActivities(await res.json());
  };

  const handleOpenModal = (activity?: Activity) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        title: activity.title,
        category: activity.category || "Sales & Marketing",
        date: activity.date,
        description: activity.description || "",
        image: activity.image || "",
      });
    } else {
      setEditingActivity(null);
      setFormData({ title: "", category: "Sales & Marketing", date: new Date().toISOString().split('T')[0], description: "", image: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingActivity ? `/api/activities/${editingActivity.id}` : "/api/activities";
    const method = editingActivity ? "PUT" : "POST";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    setIsModalOpen(false);
    fetchActivities();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/activities/${id}`, { method: "DELETE" });
    fetchActivities();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
         <div>
           <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Activities & Operations</h2>
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage corporate activities and news</p>
         </div>
         <button onClick={() => handleOpenModal()} className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-[10px] shadow-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5">
           <Plus className="h-4 w-4" /> Add Activity
         </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
           <div className="relative">
              <input type="text" placeholder="SEARCH ACTIVITIES..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 w-64" />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-widest bg-gray-50/50">
                  <th className="p-4 font-bold">Activity Title</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Date Published</th>
                  <th className="p-4 font-bold text-right">Actions</th>
               </tr>
            </thead>
            <tbody>
               {activities.length === 0 ? (
                 <tr>
                   <td colSpan={4} className="p-12 text-center text-gray-500 font-medium">
                      No activities found. Add one above.
                   </td>
                 </tr>
               ) : activities.map(activity => (
                 <tr key={activity.id} className="border-b border-gray-100/50 hover:bg-gray-50/50">
                   <td className="p-4 text-sm font-bold text-primary">{activity.title}</td>
                   <td className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">{activity.category}</td>
                   <td className="p-4 text-sm text-gray-500">{activity.date}</td>
                   <td className="p-4 text-right">
                     <button onClick={() => handleOpenModal(activity)} className="text-gray-400 hover:text-primary transition-colors p-1"><Edit className="h-4 w-4" /></button>
                     <button onClick={() => handleDelete(activity.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
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
              {editingActivity ? "Edit Activity" : "Add Activity"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Category</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary">
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Promotion">Promotion</option>
                    <option value="Processing">Processing</option>
                    <option value="R&D">R&D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Image source (Upload or URL) - <span className="text-secondary normal-case tracking-normal">Optimal: 800x600px, Max: 500KB</span></label>
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
                <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px]">Save Activity</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
