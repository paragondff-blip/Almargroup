import { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";

export default function FooterSettings() {
  const [footer, setFooter] = useState<any>(null);

  useEffect(() => {
    fetch("/api/footer")
      .then(res => res.json())
      .then(data => setFooter(data));
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(footer)
      });
      if (res.ok) {
        alert("Footer updated!");
      } else {
        alert("Failed to update footer.");
      }
    } catch (e) {
      alert("Error updating footer.");
    }
  };

  const updatePolicy = (idx: number, field: string, value: string) => {
    setFooter((prev: any) => ({
      ...prev,
      policies: prev.policies.map((p: any, i: number) => i === idx ? { ...p, [field]: value } : p)
    }));
  };

  const addPolicy = () => {
    setFooter((prev: any) => ({
      ...prev,
      policies: [...prev.policies, { id: Date.now().toString(), name: "", path: "" }]
    }));
  };

  const removePolicy = (idx: number) => {
    setFooter((prev: any) => ({
      ...prev,
      policies: prev.policies.filter((_: any, i: number) => i !== idx)
    }));
  };

  const updateContactInfo = (idx: number, field: string, value: string) => {
    setFooter((prev: any) => ({
      ...prev,
      contactInfo: prev.contactInfo.map((info: any, i: number) => i === idx ? { ...info, [field]: value } : info)
    }));
  };

  const addContactInfo = () => {
    setFooter((prev: any) => ({
      ...prev,
      contactInfo: [...(prev.contactInfo || []), { id: Date.now().toString(), icon: "MapPin", text: "" }]
    }));
  };

  const removeContactInfo = (idx: number) => {
    setFooter((prev: any) => ({
      ...prev,
      contactInfo: prev.contactInfo.filter((_: any, i: number) => i !== idx)
    }));
  };

  if (!footer) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Footer Settings</h2>
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
           <label className="block text-sm font-bold mb-2">About Text</label>
           <textarea value={footer.aboutText} onChange={e => setFooter({...footer, aboutText: e.target.value})} className="w-full p-2 border rounded" />
        </div>
        
        <div>
           <h3 className="text-lg font-bold mb-2">Policies</h3>
           {footer.policies.map((p: any, idx: number) => (
             <div key={p.id} className="flex flex-col gap-2 mb-4 border p-4 rounded bg-gray-50">
                <div className="flex gap-2">
                  <input value={p.name} onChange={e => updatePolicy(idx, 'name', e.target.value)} className="p-2 border rounded flex-1" placeholder="Name" />
                  <input value={p.path} onChange={e => updatePolicy(idx, 'path', e.target.value)} className="p-2 border rounded flex-1" placeholder="Path (e.g. /policy/name)" />
                  <button onClick={() => removePolicy(idx)} className="text-red-500"><Trash2 className="h-5 w-5" /></button>
                </div>
                <textarea rows={3} value={p.content || ""} onChange={e => updatePolicy(idx, 'content', e.target.value)} className="p-2 border rounded w-full" placeholder="Policy Content / Text" />
             </div>
           ))}
           <button onClick={addPolicy} className="flex items-center gap-2 text-primary font-bold"><Plus className="h-4 w-4" /> Add Policy</button>
        </div>

        <div>
           <h3 className="text-lg font-bold mb-2">Social Links</h3>
           {(footer.socialLinks || []).map((social: any, idx: number) => (
             <div key={social.id} className="flex gap-2 mb-2">
                <input value={social.name} onChange={e => {
                  const newLinks = [...footer.socialLinks];
                  newLinks[idx] = { ...newLinks[idx], name: e.target.value };
                  setFooter({...footer, socialLinks: newLinks});
                }} className="p-2 border rounded flex-1" placeholder="Name (e.g. Facebook)" />
                <input value={social.href} onChange={e => {
                  const newLinks = [...footer.socialLinks];
                  newLinks[idx] = { ...newLinks[idx], href: e.target.value };
                  setFooter({...footer, socialLinks: newLinks});
                }} className="p-2 border rounded flex-1" placeholder="URL Link" />
                <button onClick={() => {
                  setFooter({...footer, socialLinks: footer.socialLinks.filter((_: any, i: number) => i !== idx)});
                }} className="text-red-500"><Trash2 className="h-5 w-5" /></button>
             </div>
           ))}
           <button onClick={() => setFooter({...footer, socialLinks: [...(footer.socialLinks || []), { id: Date.now().toString(), name: "Instagram", href: "#" }]})} className="flex items-center gap-2 text-primary font-bold"><Plus className="h-4 w-4" /> Add Social Link</button>
        </div>

        <div>
           <h3 className="text-lg font-bold mb-2">Contact Info</h3>
           {footer.contactInfo?.map((info: any, idx: number) => (
             <div key={info.id} className="flex gap-2 mb-2">
                <select value={info.icon} onChange={e => updateContactInfo(idx, 'icon', e.target.value)} className="p-2 border rounded">
                  <option value="MapPin">MapPin</option>
                  <option value="Phone">Phone</option>
                  <option value="Mail">Mail</option>
                </select>
                <input value={info.text} onChange={e => updateContactInfo(idx, 'text', e.target.value)} className="p-2 border rounded flex-1" placeholder="Text" />
                <button onClick={() => removeContactInfo(idx)} className="text-red-500"><Trash2 className="h-5 w-5" /></button>
             </div>
           ))}
           <button onClick={addContactInfo} className="flex items-center gap-2 text-primary font-bold"><Plus className="h-4 w-4" /> Add Contact Info</button>
        </div>

        <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"><Save className="h-4 w-4" /> Save Changes</button>
      </div>
    </div>
  );
}
