"use client";

import { useEffect, useState } from "react";
import { 
  X, 
  Search, 
  Image as ImageIcon, 
  Upload, 
  Globe, 
  Loader2,
  Check,
  Zap
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4003";

interface MediaSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function MediaSelector({ isOpen, onClose, onSelect }: MediaSelectorProps) {
  const [activeTab, setActiveTab] = useState<"library" | "unsplash">("library");
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [unsplashImages, setUnsplashImages] = useState<any[]>([]);
  const [fetchingUnsplash, setFetchingUnsplash] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === "library") {
      fetchLibrary();
    }
  }, [isOpen, activeTab]);

  async function fetchLibrary() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/media");
      setAssets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function searchUnsplash(e: React.FormEvent) {
    e.preventDefault();
    if (!search) return;
    setFetchingUnsplash(true);
    try {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${search}&per_page=20`, {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
        }
      });
      const data = await response.json();
      setUnsplashImages(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingUnsplash(false);
    }
  }

  const handleSelectUnsplash = async (imgUrl: string) => {
    setLoading(true);
    try {
      // "Hot-copy" to our server
      const res = await apiFetch("/api/admin/media/fetch-url", {
        method: "POST",
        body: JSON.stringify({ url: imgUrl }),
      });
      onSelect(`${API_URL}${res.data.url}`);
      onClose();
    } catch (err) {
      alert("Failed to download from Unsplash");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl h-full max-h-[800px] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold text-slate-800">Media Selector</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                type="button"
                onClick={() => setActiveTab("library")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "library" ? "bg-white text-[#0098b0] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <ImageIcon size={16} /> Library
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab("unsplash")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "unsplash" ? "bg-white text-[#0098b0] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Globe size={16} /> Unsplash
              </button>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {activeTab === "library" ? (
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              {loading && assets.length === 0 ? (
                <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-[#0098b0]" size={40} /></div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {assets.map((asset) => (
                    <div 
                      key={asset.id} 
                      onClick={() => { onSelect(`${API_URL}${asset.url}`); onClose(); }}
                      className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 hover:border-[#0098b0] cursor-pointer transition-all hover:shadow-xl"
                    >
                      <img src={`${API_URL}${asset.url}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-[#0098b0]/0 group-hover:bg-[#0098b0]/10 transition-all flex items-center justify-center">
                        <Check className="text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all" size={32} strokeWidth={3} />
                      </div>
                    </div>
                  ))}
                  <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-[#0098b0] hover:text-[#0098b0] transition-all cursor-pointer">
                    <Upload size={24} />
                    <p className="text-[10px] font-bold uppercase">Upload New</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="p-8 pb-4">
                <form onSubmit={searchUnsplash} className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search high-quality images on Unsplash..." 
                    className="w-full pl-12 pr-32 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#0098b0] outline-none text-slate-900 font-medium transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#103174] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#0d2a63] transition-all flex items-center gap-2"
                  >
                    {fetchingUnsplash ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                    Search
                  </button>
                </form>
              </div>
              <div className="flex-1 p-8 pt-0 overflow-y-auto custom-scrollbar">
                {fetchingUnsplash ? (
                  <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-[#0098b0]" size={40} /></div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {unsplashImages.map((img) => (
                      <div 
                        key={img.id} 
                        onClick={() => handleSelectUnsplash(img.urls.regular)}
                        className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-[#0098b0]"
                      >
                        <img src={img.urls.small} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3">
                          <p className="text-[10px] text-white font-bold truncate">by {img.user.name}</p>
                        </div>
                        {loading && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="animate-spin text-[#0098b0]" size={24} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}
