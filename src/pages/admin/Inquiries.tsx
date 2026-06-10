import React, { useState, useEffect } from "react";
import { 
  Mail, Phone, MapPin, Search, Calendar, Trash2, Eye, EyeOff, 
  CheckCircle, ArrowLeft, RefreshCw, Paperclip, Inbox, Download
} from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  address: string;
  mobile: string;
  email?: string | null;
  description: string;
  attachmentName?: string | null;
  attachmentData?: string | null;
  read: boolean;
  createdAt: string;
}

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInquiries = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/contacts");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    
    // Auto-poll inquiries every 10 seconds for real-time notifications updates
    const interval = setInterval(() => {
      fetchInquiries(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}/read`, { method: "PUT" });
      if (res.ok) {
        // Update local state instantly
        setInquiries(prev => prev.map(item => item.id === id ? { ...item, read: true } : item));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(prev => prev ? { ...prev, read: true } : null);
        }
      }
    } catch (err) {
      console.error("Error marking inquiry as read:", err);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!window.confirm("Are you sure you want to delete this notification message?")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries(prev => prev.filter(item => item.id !== id));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (err) {
      console.error("Error deleting inquiry:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleInquiryClick = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    if (!inquiry.read) {
      handleMarkAsRead(inquiry.id);
    }
  };

  // Filter & search inquiries
  const filteredInquiries = inquiries.filter(item => {
    const matchesFilter = 
      filter === "all" ||
      (filter === "unread" && !item.read) ||
      (filter === "read" && item.read);

    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mobile.includes(searchQuery) ||
      (item.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = inquiries.filter(item => !item.read).length;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Inquiries & Notifications 
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full animate-bounce">
                {unreadCount} NEW
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Manage contact form feedback submissions and customer messages in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setRefreshing(true); fetchInquiries(); }}
            disabled={refreshing}
            className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50 active:scale-95 transition-all shadow-sm flex items-center justify-center disabled:opacity-50"
            title="Refresh List"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: List of Messages */}
        <div className={`col-span-12 ${selectedInquiry ? "lg:col-span-5 hidden lg:block" : "lg:col-span-12"}`}>
          {/* Controls */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Search */}
              <div className="relative w-full md:w-72">
                <input 
                  type="text" 
                  placeholder="SEARCH SMS/INQUIRIES..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs font-black uppercase tracking-widest w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              {/* Filter Tabs */}
              <div className="flex bg-gray-50 p-1 border border-gray-100 rounded-lg w-full md:w-auto">
                <button 
                  onClick={() => setFilter("all")}
                  className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${filter === "all" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
                >
                  All ({inquiries.length})
                </button>
                <button 
                  onClick={() => setFilter("unread")}
                  className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${filter === "unread" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
                >
                  Unread ({unreadCount})
                </button>
                <button 
                  onClick={() => setFilter("read")}
                  className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${filter === "read" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
                >
                  Read ({inquiries.length - unreadCount})
                </button>
              </div>
            </div>
          </div>

          {/* List content */}
          {loading ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
              <span className="font-bold text-gray-500 uppercase tracking-widest animate-pulse flex items-center justify-center gap-3">
                <RefreshCw className="h-5 w-5 animate-spin" /> Gathering Inquiries...
              </span>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-xl shadow-sm p-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4 border border-gray-100">
                <Inbox className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">No Inquiries Found</h3>
              <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">
                {searchQuery ? "No entries match your search query." : "When customers fill out the contact form, notifications will appear here instantly."}
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100 overflow-hidden">
              {filteredInquiries.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleInquiryClick(item)}
                  className={`p-5 transition-all duration-200 cursor-pointer flex justify-between items-start gap-4 ${!item.read ? "bg-blue-50/40 border-l-4 border-secondary hover:bg-blue-50/70" : "hover:bg-gray-50"}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className={`text-sm truncate ${!item.read ? "font-black text-primary" : "font-semibold text-gray-700"}`}>
                        {item.name}
                      </h4>
                      {!item.read && (
                        <span className="w-2.5 h-2.5 bg-secondary rounded-full shrink-0" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 inline" /> {formatDate(item.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    {item.attachmentName && (
                      <div className="mt-2.5 inline-flex items-center gap-1 bg-gray-100 rounded-md px-2 py-1 text-[10px] font-bold text-gray-500 border border-gray-200 shrink-0">
                        <Paperclip className="h-3 w-3 text-secondary" /> {item.attachmentName}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      disabled={deletingId === item.id}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <span className="text-gray-400"><Eye className="h-4 w-4" /></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side / Detaled Panel */}
        {selectedInquiry ? (
          <div className="col-span-12 lg:col-span-7 bg-white border border-gray-200 rounded-2xl shadow-md p-6 lg:p-8 relative sticky top-24">
            {/* Back Button (Mobile) */}
            <button 
              onClick={() => setSelectedInquiry(null)}
              className="lg:hidden flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-primary uppercase tracking-wide mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Back to List
            </button>

            {/* Profile / Badge section */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-gray-100">
              <div className="flex gap-4">
                <div className="h-14 w-14 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center text-xl font-black shrink-0">
                  {selectedInquiry.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-primary tracking-tight uppercase">{selectedInquiry.name}</h3>
                  <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">Submitted: {formatDate(selectedInquiry.createdAt)}</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => handleDelete(selectedInquiry.id)}
                  className="flex-1 sm:flex-none p-2.5 border border-red-200 hover:bg-red-50 text-red-500 rounded-lg transition-colors flex items-center justify-center text-xs font-bold uppercase tracking-wider gap-2 shadow-sm"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>

            {/* Submitter Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-b border-gray-100">
              <div className="flex items-start gap-3 bg-gray-50 p-3.5 border border-gray-100 rounded-xl">
                <Phone className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="block text-[9px] font-black uppercase text-gray-400 tracking-wider">Mobile Number</span>
                  <a href={`tel:${selectedInquiry.mobile}`} className="text-sm font-bold text-gray-800 hover:underline">{selectedInquiry.mobile}</a>
                </div>
              </div>

              {selectedInquiry.email && (
                <div className="flex items-start gap-3 bg-gray-50 p-3.5 border border-gray-100 rounded-xl">
                  <Mail className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="block text-[9px] font-black uppercase text-gray-400 tracking-wider">Email Address</span>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-sm font-bold text-gray-800 hover:underline truncate block">{selectedInquiry.email}</a>
                  </div>
                </div>
              )}

              <div className="col-span-1 md:col-span-2 flex items-start gap-3 bg-gray-50 p-3.5 border border-gray-100 rounded-xl">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="block text-[9px] font-black uppercase text-gray-400 tracking-wider">Location / Address</span>
                  <span className="text-sm font-medium text-gray-700">{selectedInquiry.address}</span>
                </div>
              </div>
            </div>

            {/* Core Message SMS */}
            <div className="py-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Inquiry Details / Message</h4>
              <div className="bg-blue-50/20 border border-blue-100 rounded-xl p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                {selectedInquiry.description}
              </div>
            </div>

            {/* Attachments */}
            {selectedInquiry.attachmentName && (
              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-secondary/10 text-secondary rounded-lg">
                    <Paperclip className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black uppercase text-gray-700 tracking-wider truncate max-w-xs">{selectedInquiry.attachmentName}</h5>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">Contact Attachment File</p>
                  </div>
                </div>
                {selectedInquiry.attachmentData && (
                  <a 
                    href={selectedInquiry.attachmentData}
                    download={selectedInquiry.attachmentName}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow transition-all self-stretch sm:self-auto"
                  >
                    <Download className="h-4 w-4" /> Download PDF/Image
                  </a>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="hidden lg:col-span-7 bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[450px]">
            <div className="h-16 w-16 bg-blue-50/60 text-secondary rounded-2xl flex items-center justify-center mb-5">
              <Mail className="h-8 w-8 animate-pulse" />
            </div>
            <h3 className="text-lg font-black text-primary uppercase tracking-wider">No Message Selected</h3>
            <p className="text-xs text-gray-400 mt-2 max-w-sm">
              Click on an inquiry notification from the left list block to inspect its full SMS details, download attached files, or coordinate records.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
