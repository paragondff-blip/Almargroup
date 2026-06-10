import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  date: string;
}

export default function AdminCareers() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-Time",
    salary: "",
    experience: "",
    date: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await fetch("/api/jobs");
    setJobs(await res.json());
  };

  const handleOpenModal = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        salary: job.salary || "",
        experience: job.experience || "",
        date: job.date || "",
      });
    } else {
      setEditingJob(null);
      setFormData({ title: "", department: "", location: "", type: "Full-Time", salary: "", experience: "", date: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const url = editingJob ? `/api/jobs/${editingJob.id}` : "/api/jobs";
    const method = editingJob ? "PUT" : "POST";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    setIsModalOpen(false);
    fetchJobs();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    fetchJobs();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
         <div>
           <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Career Portal</h2>
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage job postings and applications</p>
         </div>
         <button onClick={() => handleOpenModal()} className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-[10px] shadow-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5">
           <Plus className="h-4 w-4" /> Post New Job
         </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
           <div className="relative">
              <input type="text" placeholder="SEARCH ROLES..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 w-64" />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-widest bg-gray-50/50">
                  <th className="p-4 font-bold">Job Title</th>
                  <th className="p-4 font-bold">Department</th>
                  <th className="p-4 font-bold">Location</th>
                  <th className="p-4 font-bold">Applicants</th>
                  <th className="p-4 font-bold text-right">Actions</th>
               </tr>
            </thead>
            <tbody>
               {jobs.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="p-12 text-center text-gray-500 font-medium">
                      No career opportunities found. Add one above.
                   </td>
                 </tr>
               ) : jobs.map(job => (
                 <tr key={job.id} className="border-b border-gray-100/50 hover:bg-gray-50/50">
                   <td className="p-4 text-sm font-bold text-primary">{job.title}</td>
                   <td className="p-4 text-sm">{job.department}</td>
                   <td className="p-4 text-sm text-gray-500">{job.location}</td>
                   <td className="p-4 text-sm font-bold text-primary">0</td>
                   <td className="p-4 text-right">
                     <button onClick={() => handleOpenModal(job)} className="text-gray-400 hover:text-primary transition-colors p-1"><Edit className="h-4 w-4" /></button>
                     <button onClick={() => handleDelete(job.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-primary uppercase tracking-tighter mb-4">
              {editingJob ? "Edit Job" : "Post New Job"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Job Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Department</label>
                  <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Location</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary">
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Salary Range</label>
                  <input type="text" placeholder="e.g. $80k - $100k" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px]">Save Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
