import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Megaphone, Award, Factory, RefreshCw, ArrowRight } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  image: string;
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    fetch("/api/activities")
      .then(res => res.json())
      .then(data => setActivities(data));
  }, []);

  const categories = ["All", "Sales & Marketing", "Promotion", "Processing", "R&D"];

  const getIconForCategory = (category: string) => {
    switch (category) {
      case "Sales & Marketing": return <Megaphone className="h-8 w-8 text-secondary"/>;
      case "Promotion": return <Award className="h-8 w-8 text-secondary"/>;
      case "Processing": return <RefreshCw className="h-8 w-8 text-secondary"/>;
      default: return <Factory className="h-8 w-8 text-secondary"/>;
    }
  };

  const filteredActivities = selectedCategory === "All" 
    ? activities 
    : activities.filter(a => a.category === selectedCategory);

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 uppercase tracking-tighter">Our Operations & Activities</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
          The core pillars of Almar Group's success are built upon rigorous processes, innovation, and unwavering commitment.
        </p>
        
        <div className="inline-block relative w-64">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-primary font-bold uppercase tracking-widest text-xs"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredActivities.length === 0 ? (
           <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">No activities found in this category.</div>
        ) : (
          <div className="space-y-20">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
                 <motion.div 
                   initial={{ opacity: 0, x: index % 2 !== 0 ? 50 : -50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.6 }}
                   className="lg:w-1/2"
                 >
                   <div className="h-16 w-16 bg-accent rounded-2xl flex items-center justify-center mb-6">
                      {getIconForCategory(activity.category)}
                   </div>
                   <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">{activity.category} • {activity.date}</div>
                   <h2 className="text-3xl font-black text-primary mb-4 tracking-tighter">{activity.title}</h2>
                   <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                     {activity.description}
                   </p>
                   <button className="text-[10px] text-secondary font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
                     View Achievements <ArrowRight className="h-4 w-4" />
                   </button>
                 </motion.div>
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.6 }}
                   className="lg:w-1/2 w-full"
                 >
                    <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl">
                       <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                    </div>
                 </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
