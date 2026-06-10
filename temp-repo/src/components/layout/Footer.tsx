import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Building2, Mail, Phone, MapPin, Facebook, Linkedin, Twitter, Instagram, Youtube,
  X, Send, Paperclip, CheckCircle2, AlertCircle, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Footer() {
  const [footer, setFooter] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  
  // Contact Dialog States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentData, setAttachmentData] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/footer")
      .then(res => res.json())
      .then(data => setFooter(data));
      
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size is too big! Please keep it under 5MB.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentData(reader.result as string);
        setAttachmentName(file.name);
      };
      reader.onerror = () => {
        alert("Could not process the selected file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !mobile.trim() || !description.trim()) {
      setError("Please fill in all required fields (Name, Address, Mobile, and Description).");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          address,
          mobile,
          email: email.trim() || undefined,
          description,
          attachmentName,
          attachmentData
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setSuccess(true);
        // Reset form
        setName("");
        setAddress("");
        setMobile("");
        setEmail("");
        setDescription("");
        setAttachmentName("");
        setAttachmentData("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => {
          setSuccess(false);
          setIsModalOpen(false);
        }, 3000);
      } else {
        setError(resData.message || "Failed to submit message to the server.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!footer || !settings) return null;

  const getIcon = (name: string) => {
    switch (name) {
        case "MapPin": return <MapPin className="h-5 w-5 text-secondary flex-shrink-0" />;
        case "Phone": return <Phone className="h-5 w-5 text-secondary flex-shrink-0" />;
        case "Mail": return <Mail className="h-5 w-5 text-secondary flex-shrink-0" />;
        default: return null;
    }
  }

  const getSocialIcon = (name: string) => {
    switch (name) {
        case "Facebook": return <Facebook className="h-5 w-5" />;
        case "Linkedin": return <Linkedin className="h-5 w-5" />;
        case "Twitter": return <Twitter className="h-5 w-5" />;
        case "Instagram": return <Instagram className="h-5 w-5" />;
        case "Youtube": return <Youtube className="h-5 w-5" />;
        default: return null;
    }
  }

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              {(() => {
                const companyNameStr = settings?.companyName || "Almar Group";
                const firstWord = companyNameStr.split(' ')[0];
                const remainingWords = companyNameStr.split(' ').slice(1).join(' ');
                return settings?.mainLogo ? (
                  <>
                    <img src={settings.mainLogo} alt="Logo" className="w-auto h-10 object-contain bg-white rounded p-1" />
                    <span className="text-2xl font-black tracking-tighter uppercase text-white">
                      {firstWord}
                      {remainingWords && <span className="text-secondary"> {remainingWords}</span>}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary font-bold text-2xl italic">{firstWord ? firstWord[0] : 'A'}</div>
                    <span className="text-2xl font-black tracking-tighter uppercase text-white">
                      {firstWord}
                      {remainingWords && <span className="text-secondary"> {remainingWords}</span>}
                    </span>
                  </>
                );
              })()}
            </Link>
            <p className="text-blue-100 mb-6 max-w-sm">
              {footer.aboutText}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-4 italic">Contact Info</h4>
            <ul className="space-y-3 text-blue-100 mb-4">
              {footer.contactInfo.map((info: any) => (
                  <li key={info.id} className="flex items-center gap-3">
                    {getIcon(info.icon)}
                    <span>{info.text}</span>
                  </li>
              ))}
            </ul>
            <button
              onClick={() => {
                setError("");
                setSuccess(false);
                setIsModalOpen(true);
              }}
              className="mt-3 inline-flex items-center gap-2 bg-secondary text-primary hover:bg-white hover:scale-105 active:scale-95 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md cursor-pointer"
            >
              Contact with us &rarr;
            </button>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-4 italic">Policies</h4>
            <ul className="space-y-2 text-blue-100">
                {footer.policies.map((p: any) => (
                    <li key={p.id}><Link to={p.path} className="hover:text-white transition-colors">{p.name}</Link></li>
                ))}
            </ul>
          </div>

          <div>
             <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-4 italic">Follow Us</h4>
             <div className="flex flex-wrap gap-4">
                {footer.socialLinks.map((s: any) => (
                    <a key={s.id} href={s.href} className="bg-white/10 p-2 rounded-full hover:bg-secondary transition-all">{getSocialIcon(s.name)}</a>
                ))}
             </div>
             <div className="mt-8">
               <Link to="/admin" className="text-secondary text-sm font-medium hover:text-white transition-colors">Admin Login</Link>
               <br />
               <Link to="/track-order" className="text-secondary text-sm font-medium hover:text-white transition-colors">Track Order</Link>
             </div>
          </div>

        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-8 text-[10px] font-bold uppercase tracking-wider text-white/60">
            {footer.policies.slice(0, 3).map((p: any) => (
                <Link key={p.id} to={p.path} className="hover:text-white">{p.name}</Link>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider text-center">Payment Gateways Enabled</span>
              </div>
             <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider italic">© {new Date().getFullYear()} {settings?.companyName || "Almar Group"}. All Rights Reserved.</p>
          </div>
        </div>
      </div>

      {/* Modern Send Message / Contact With Us Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Backdrop with modern blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!submitting) setIsModalOpen(false);
              }}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
              id="contact-modal-backdrop"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-white rounded-3xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl z-10 border border-gray-100 text-black font-sans"
              id="contact-modal-card"
            >
              {/* Modal Header */}
              <div className="bg-primary text-white p-6 relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all disabled:opacity-50"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="text-[9px] bg-secondary text-primary font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block">
                  Support Desk
                </span>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
                  Contact with us
                </h3>
                <p className="text-xs text-blue-100/80 mt-1">
                  Send your enquiry and our representatives will reach out shortly.
                </p>
              </div>

              {/* Scrollable Form Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {success ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-8 space-y-3"
                  >
                    <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
                    <h4 className="text-lg font-black text-primary uppercase tracking-tight">Message Sent Successfully!</h4>
                    <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                      Thank you for contacting Almar Group. Your inquiry has been dispatched and a copy has been sent to your email.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                    {error && (
                      <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg flex items-start gap-2 border border-red-100">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="font-medium">{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary font-semibold text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="e.g. +1 123 4567"
                          className="w-full border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary font-semibold text-gray-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 123 corporate Rd, Suite 400"
                        className="w-full border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary font-semibold text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. john@example.com"
                        className="w-full border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary font-semibold text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">
                        Description / Inquiry Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detail your corporate inquiry, order assistance request, or general questions here..."
                        className="w-full border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary font-medium text-gray-800 leading-relaxed"
                      />
                    </div>

                    {/* Attachment Option with File Type Suggestions */}
                    <div className="border border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-gray-500">
                          Add Attachment (Optional)
                        </label>
                        {attachmentName && (
                          <button
                            type="button"
                            onClick={() => {
                              setAttachmentName("");
                              setAttachmentData("");
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="text-[9px] font-bold text-red-500 hover:underline uppercase tracking-wide"
                          >
                            Remove file
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5 shadow-sm transition-all shrink-0 active:scale-95"
                        >
                          <Paperclip className="h-3.5 w-3.5" />
                          {attachmentName ? "Change File" : "Choose File"}
                        </button>
                        <span className="text-[10px] text-gray-500 font-medium truncate">
                          {attachmentName || "No file selected"}
                        </span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>

                      {/* File Type Suggestions */}
                      <p className="text-[9px] text-gray-400 font-medium mt-2 leading-snug">
                        💡 <span className="font-semibold text-gray-500">Allowed formats:</span> PDF, Word (doc/docx), JPG, PNG, ZIP. Maximum size: <span className="font-semibold text-gray-500">5MB</span>.
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 pt-2 shrink-0 border-t border-gray-100 mt-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        disabled={submitting}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-primary hover:bg-primary/95 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-3 w-3" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
