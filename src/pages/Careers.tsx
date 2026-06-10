import { useState, useEffect } from "react";
import { Briefcase, MapPin, Clock, DollarSign, X, CheckCircle } from "lucide-react";
import type { Job } from "../types";

export default function Careers() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetch("/api/jobs")
      .then(res => res.json())
      .then(data => setJobs(data));
  }, []);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setApplied(true);
      setTimeout(() => {
        setApplied(false);
        setApplyingJob(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 uppercase tracking-tighter">Join Our Team</h1>
        <p className="text-gray-600 text-lg">
          At Almar Group, we believe that our people are our greatest asset. Build an impactful career shaping the future of global enterprise.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
         <div className="space-y-6">
            {jobs.map(job => (
               <div key={job.id} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 hover:border-secondary hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div>
                        <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
                          {job.department}
                        </div>
                        <h2 className="text-2xl font-black text-primary mb-4 tracking-tighter">{job.title}</h2>
                        
                        <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                           <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4"/> {job.location}</div>
                           <div className="flex items-center gap-1.5"><Briefcase className="h-4 w-4"/> {job.type}</div>
                           <div className="flex items-center gap-1.5"><DollarSign className="h-4 w-4"/> {job.salary}</div>
                           <div className="flex items-center gap-1.5"><Clock className="h-4 w-4"/> {job.date}</div>
                        </div>
                     </div>
                     
                     <div className="shrink-0 flex flex-col gap-3">
                        <button 
                          onClick={() => setApplyingJob(job)}
                          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors w-full md:w-auto text-center shadow-md"
                        >
                          Apply Now
                        </button>
                        <button 
                          onClick={() => setSelectedJob(job)}
                          className="bg-accent hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors w-full md:w-auto text-center"
                        >
                          View Details
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 relative">
            <button 
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
              {selectedJob.department}
            </div>
            <h2 className="text-3xl font-black text-primary mb-6 tracking-tighter">{selectedJob.title}</h2>
            
            <div className="flex flex-wrap gap-6 text-gray-600 text-sm mb-8 bg-gray-50 p-4 rounded-xl">
               <div className="flex items-center gap-2 font-medium"><MapPin className="h-4 w-4 text-secondary"/> {selectedJob.location}</div>
               <div className="flex items-center gap-2 font-medium"><Briefcase className="h-4 w-4 text-secondary"/> {selectedJob.type}</div>
               <div className="flex items-center gap-2 font-medium"><DollarSign className="h-4 w-4 text-secondary"/> {selectedJob.salary}</div>
               <div className="flex items-center gap-2 font-medium"><Clock className="h-4 w-4 text-secondary"/> {selectedJob.date}</div>
            </div>

            <div className="space-y-6 text-gray-600 mb-8 max-h-[40vh] overflow-y-auto">
              <div>
                <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-2">Job Description</h3>
                <p>We are looking for a dedicated and skilled {selectedJob.title} to join our {selectedJob.department} team. In this role, you will be instrumental in driving our corporate objectives and fostering an environment of excellence and innovation.</p>
              </div>
              <div>
                <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-2">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>At least {selectedJob.experience} experience in a related role.</li>
                  <li>Exceptional communication and leadership skills.</li>
                  <li>Ability to thrive in a fast-paced corporate environment.</li>
                  <li>Strong analytical and problem-solving mindset.</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
               <button 
                 onClick={() => { setSelectedJob(null); setApplyingJob(selectedJob); }}
                 className="flex-1 bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-lg"
               >
                 Apply for this position
               </button>
               <button 
                 onClick={() => setSelectedJob(null)}
                 className="px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-colors"
               >
                 Close
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyingJob && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative">
            <button 
              onClick={() => !isApplying && !applied && setApplyingJob(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              disabled={isApplying || applied}
            >
              <X className="h-6 w-6" />
            </button>
            
            {applied ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-primary mb-2 tracking-tighter">Application Sent!</h3>
                <p className="text-gray-600">Thank you for applying to the {applyingJob.title} position. Our team will review your application and contact you soon.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-black text-primary mb-2 tracking-tighter">Apply Now</h3>
                <p className="text-sm text-gray-500 mb-6 font-medium">Position: {applyingJob.title}</p>
                
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Full Name</label>
                    <input required type="text" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address</label>
                    <input required type="email" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Phone Number</label>
                    <input required type="tel" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Resume / CV (PDF)</label>
                    <input required type="file" accept=".pdf,.doc,.docx" className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-primary text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isApplying}
                    className="w-full mt-6 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-lg"
                  >
                    {isApplying ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
