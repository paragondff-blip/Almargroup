import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Image as ImageIcon, Type, Link as LinkIcon, Settings2, ShieldCheck, PenTool, CheckCircle, Upload } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishSuccess(false);
    
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });

    setIsPublishing(false);
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, [fieldName]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const promptForImageUrl = (fieldName: string) => {
    const url = prompt("Enter Image URL:");
    if (url) {
      setSettings(prev => ({ ...prev, [fieldName]: url }));
    }
  };

  if (!settings) return <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest">Loading settings...</div>;

  const tabs = [
    { id: "general", label: "General & Identity", icon: <Settings2 className="h-4 w-4" /> },
    { id: "header", label: "Header & Navigation", icon: <LinkIcon className="h-4 w-4" /> },
    { id: "hero", label: "Hero Banner & Media", icon: <ImageIcon className="h-4 w-4" /> },
    { id: "content", label: "Dynamic Content", icon: <Type className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Content Management</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage all website info, images, brands, and content</p>
        </div>
        <div className="flex items-center gap-4">
          {publishSuccess && (
            <span className="text-green-600 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1 animate-in fade-in">
              <CheckCircle className="h-4 w-4" /> Published
            </span>
          )}
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isPublishing ? "Publishing..." : <><Save className="h-4 w-4" /> Publish Changes</>}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === "general" && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-black text-primary uppercase tracking-tighter mb-4">Corporate Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Company Name</label>
                    <input type="text" defaultValue="Almar Group" className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Tagline</label>
                    <input type="text" defaultValue="Empowering global growth" className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">SEO Meta Description</label>
                    <textarea rows={3} defaultValue="Enterprise-grade MNC-style corporate website..." className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-black text-primary uppercase tracking-tighter mb-4">Logos & Assets</h3>
                <div className="flex items-center gap-6">
                  
                  <div className="w-48 h-32 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 relative group flex items-center justify-center">
                    {settings.mainLogo ? (
                       <img src={settings.mainLogo} alt="Main Logo" className="w-full h-full object-contain p-4 bg-white" />
                    ) : (
                       <div className="text-gray-400 text-center flex flex-col items-center">
                         <ImageIcon className="h-6 w-6 mb-1" />
                         <span className="text-[9px] font-bold uppercase tracking-widest">Main Logo</span>
                         <span className="text-[8px] text-gray-400 mt-1">Optimal: 200x100px PNG (Max 500KB)</span>
                       </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                       <button onClick={() => promptForImageUrl('mainLogo')} className="text-white text-[9px] font-bold uppercase tracking-widest bg-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-700">Set URL</button>
                       <label className="text-white text-[9px] font-bold uppercase tracking-widest bg-primary px-3 py-1.5 rounded-md hover:bg-primary/90 cursor-pointer">
                          Upload File
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'mainLogo')} />
                       </label>
                    </div>
                  </div>

                  <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 relative group flex items-center justify-center">
                    {settings.favicon ? (
                       <img src={settings.favicon} alt="Favicon" className="w-full h-full object-contain p-2 bg-white" />
                    ) : (
                       <div className="text-gray-400 text-center flex flex-col items-center">
                         <ImageIcon className="h-5 w-5 mb-1" />
                         <span className="text-[9px] font-bold uppercase tracking-widest">Favicon</span>
                         <span className="text-[8px] text-gray-400 mt-1">Optimal: 32x32px ICO (Max 50KB)</span>
                       </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                       <button onClick={() => promptForImageUrl('favicon')} className="text-white text-[8px] font-bold uppercase tracking-widest bg-gray-800 px-2 py-1 rounded-md hover:bg-gray-700">URL</button>
                       <label className="text-white text-[8px] font-bold uppercase tracking-widest bg-primary px-2 py-1 rounded-md hover:bg-primary/90 cursor-pointer">
                          Upload
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'favicon')} />
                       </label>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          )}

          {activeTab === "header" && (
            <div className="space-y-8 animate-in fade-in">
              <h3 className="text-lg font-black text-primary uppercase tracking-tighter mb-4">Navigation Menu Builder</h3>
              <p className="text-sm text-gray-600 mb-6 font-medium">Add, edit, or reorder the links appearing in the top navigation header.</p>
              
              <div className="space-y-3">
                {(settings.navLinks || []).map((link: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        value={link.name} 
                        onChange={(e) => {
                           const newLinks = [...settings.navLinks];
                           newLinks[i].name = e.target.value;
                           setSettings({...settings, navLinks: newLinks});
                        }}
                        className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary" 
                      />
                      <input 
                        type="text" 
                        value={link.path} 
                        onChange={(e) => {
                           const newLinks = [...settings.navLinks];
                           newLinks[i].path = e.target.value;
                           setSettings({...settings, navLinks: newLinks});
                        }}
                        className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-primary text-gray-500" 
                      />
                    </div>
                    <button 
                      onClick={() => {
                         const newLinks = settings.navLinks.filter((_: any, index: number) => index !== i);
                         setSettings({...settings, navLinks: newLinks});
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setSettings({...settings, navLinks: [...(settings.navLinks || []), { name: "New Link", path: "/" }]})}
                className="mt-4 border-2 border-dashed border-gray-300 text-gray-500 hover:border-primary hover:text-primary w-full py-4 rounded-lg font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Menu Item
              </button>
            </div>
          )}

          {activeTab === "hero" && (
            <div className="space-y-8 animate-in fade-in">
              <h3 className="text-lg font-black text-primary uppercase tracking-tighter mb-4">Homepage Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Heading Line 1</label>
                    <input type="text" value={settings.heroTitle?.split(' ')[0] || "Welcome"} onChange={(e) => setSettings({...settings, heroTitle: e.target.value + ' ' + (settings.heroTitle?.split(' ').slice(1).join(' ') || '')})} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Heading Line 2 (Highlighted)</label>
                    <input type="text" value={settings.heroTitle?.split(' ').slice(1).join(' ') || "Almar Group"} onChange={(e) => setSettings({...settings, heroTitle: (settings.heroTitle?.split(' ')[0] || '') + ' ' + e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Subheading Description</label>
                    <textarea rows={4} value={settings.heroSubtitle || ""} onChange={(e) => setSettings({...settings, heroSubtitle: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Current Background Cover</label>
                  <div className="relative group rounded-xl overflow-hidden shadow-sm h-64 border border-gray-200">
                    <img src={settings.heroCover || "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"} alt="Current cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-4">
                      <button onClick={() => promptForImageUrl('heroCover')} className="bg-gray-800 text-white px-4 py-2 rounded-md font-bold uppercase tracking-widest text-[10px] hover:bg-gray-700">Enter Image URL</button>
                      <label className="bg-primary text-white cursor-pointer px-4 py-2 rounded-md font-bold uppercase tracking-widest text-[10px] hover:bg-primary/90">
                        Upload File
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'heroCover')} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-black text-primary uppercase tracking-tighter mb-4">Corporate & About Sections</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">About Section Title</label>
                        <input type="text" value={settings.aboutTitle || ""} onChange={(e) => setSettings({...settings, aboutTitle: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">About Section Description</label>
                        <input type="text" value={settings.aboutDesc || ""} onChange={(e) => setSettings({...settings, aboutDesc: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Corporate Section Title</label>
                        <input type="text" value={settings.corpTitle || ""} onChange={(e) => setSettings({...settings, corpTitle: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none" />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-2 gap-6">
                        <div>
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">About Image URL</label>
                           <input type="text" value={settings.aboutImage || ""} onChange={(e) => setSettings({...settings, aboutImage: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none" />
                           {settings.aboutImage && <img src={settings.aboutImage} alt="About" className="mt-2 h-20 w-auto rounded" />}
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Corporate Image URL</label>
                           <input type="text" value={settings.corpImage || ""} onChange={(e) => setSettings({...settings, corpImage: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none" />
                           {settings.corpImage && <img src={settings.corpImage} alt="Corp" className="mt-2 h-20 w-auto rounded" />}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Mission</label>
                        <textarea rows={2} value={settings.mission || ""} onChange={(e) => setSettings({...settings, mission: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Vision</label>
                        <textarea rows={2} value={settings.vision || ""} onChange={(e) => setSettings({...settings, vision: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none" />
                    </div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-black text-primary uppercase tracking-tighter mb-4">Scrolling Strip Images</h3>
                <div className="space-y-3">
                   {(settings.scrollingImages || []).map((imgUrl: string, idx: number) => (
                     <div key={idx} className="flex gap-2 items-center">
                        {imgUrl && <img src={imgUrl} className="w-12 h-12 object-cover rounded shadow-sm bg-gray-100" />}
                        <input value={imgUrl} onChange={e => {
                          const newImages = [...settings.scrollingImages];
                          newImages[idx] = e.target.value;
                          setSettings({...settings, scrollingImages: newImages});
                        }} className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-primary w-full" placeholder="Image URL" />
                        <button onClick={() => {
                          const newImages = settings.scrollingImages.filter((_: any, i: number) => i !== idx);
                          setSettings({...settings, scrollingImages: newImages});
                        }} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"><Trash2 className="h-4 w-4"/></button>
                     </div>
                   ))}
                   <button onClick={() => setSettings({...settings, scrollingImages: [...(settings.scrollingImages || []), ""]})} className="text-primary font-bold flex items-center gap-2 mt-4 hover:bg-primary/5 px-3 py-2 rounded transition-colors"><Plus className="h-4 w-4"/> Add Image URL</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="space-y-8 animate-in fade-in text-center py-12">
               <PenTool className="h-16 w-16 text-gray-300 mx-auto mb-4" />
               <h3 className="text-xl font-black text-primary uppercase tracking-tighter mb-2">Dynamic Module Management</h3>
               <p className="text-sm text-gray-500 max-w-lg mx-auto font-medium">From here, you can manage all dynamic blocks like Brands databases, Employee profiles, Office images, News articles, and more.</p>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                 {['Brands', 'Products', 'Activities', 'News', 'Careers', 'Gallery'].map(mod => (
                    <div key={mod} className="border border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-md cursor-pointer transition-all">
                       <span className="font-bold text-gray-700 uppercase tracking-widest text-[11px] block">{mod}</span>
                       <span className="text-[10px] text-gray-400 mt-2 block">Manage items</span>
                    </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
