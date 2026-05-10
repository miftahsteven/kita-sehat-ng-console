"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { apiFetch } from "@/lib/api";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Monitor, 
  Smartphone, 
  Layout, 
  ToggleLeft, 
  ToggleRight,
  Loader2,
  Image as ImageIcon,
  ExternalLink,
  GripVertical,
  CheckCircle2
} from "lucide-react";
import MediaSelector from "@/components/media/MediaSelector";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4003";

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    BANNER_HEADER_ENABLED: false,
    BANNER_MIDDLE_ENABLED: false,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"HEADER_TOP" | "BELOW_HERO">("HEADER_TOP");
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [name, setName] = useState("");
  const [imageUrlDesktop, setImageUrlDesktop] = useState("");
  const [imageUrlMobile, setImageUrlMobile] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [order, setOrder] = useState(0);
  
  // Media Selector State
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [bannersRes, settingsRes] = await Promise.all([
        apiFetch("/api/admin/banners"),
        apiFetch("/api/admin/banners/settings")
      ]);
      setBanners(bannersRes.data);
      setSettings(settingsRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleSetting = async (key: string, value: boolean) => {
    try {
      await apiFetch("/api/admin/banners/settings", {
        method: "POST",
        body: JSON.stringify({ key, value }),
      });
      setSettings((prev: any) => ({ ...prev, [key]: value }));
    } catch (err) {
      alert("Failed to update setting");
    }
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setName(banner.name);
    setImageUrlDesktop(banner.imageUrlDesktop);
    setImageUrlMobile(banner.imageUrlMobile || "");
    setTargetUrl(banner.targetUrl || "");
    setOrder(banner.order || 0);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingBanner(null);
    setName("");
    setImageUrlDesktop("");
    setImageUrlMobile("");
    setTargetUrl("");
    setOrder(0);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      placement: activeTab,
      imageUrlDesktop,
      imageUrlMobile,
      targetUrl,
      order,
    };

    try {
      if (editingBanner) {
        await apiFetch(`/api/admin/banners/${editingBanner.id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
      } else {
        await apiFetch("/api/admin/banners", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }
      fetchData();
      resetForm();
    } catch (err) {
      alert("Failed to save banner");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await apiFetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      alert("Failed to delete banner");
    }
  };

  const openMediaSelector = (target: "desktop" | "mobile") => {
    setMediaTarget(target);
    setIsMediaOpen(true);
  };

  const handleMediaSelect = (url: string) => {
    if (mediaTarget === "desktop") {
      setImageUrlDesktop(url);
    } else {
      setImageUrlMobile(url);
    }
    setIsMediaOpen(false);
  };

  const filteredBanners = banners.filter(b => b.placement === activeTab);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Ads & Banners</h1>
            <p className="text-slate-500">Manage promotional content and advertisement slots.</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 bg-[#0098b0] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#007a8d] transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus size={20} />
            Add New Slide
          </button>
        </div>

        {/* Global Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${settings.BANNER_HEADER_ENABLED ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>
                <Layout size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Header Ad Slot</p>
                <p className="text-xs text-slate-500">Top of every page</p>
              </div>
            </div>
            <button 
              onClick={() => handleToggleSetting("BANNER_HEADER_ENABLED", !settings.BANNER_HEADER_ENABLED)}
              className={`transition-all ${settings.BANNER_HEADER_ENABLED ? "text-[#0098b0]" : "text-slate-300"}`}
            >
              {settings.BANNER_HEADER_ENABLED ? <ToggleRight size={48} strokeWidth={1.5} /> : <ToggleLeft size={48} strokeWidth={1.5} />}
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${settings.BANNER_MIDDLE_ENABLED ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>
                <Monitor size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Middle Ad Slot</p>
                <p className="text-xs text-slate-500">Below the hero section</p>
              </div>
            </div>
            <button 
              onClick={() => handleToggleSetting("BANNER_MIDDLE_ENABLED", !settings.BANNER_MIDDLE_ENABLED)}
              className={`transition-all ${settings.BANNER_MIDDLE_ENABLED ? "text-[#0098b0]" : "text-slate-300"}`}
            >
              {settings.BANNER_MIDDLE_ENABLED ? <ToggleRight size={48} strokeWidth={1.5} /> : <ToggleLeft size={48} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Banner Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab("HEADER_TOP")}
              className={`px-8 py-5 text-sm font-bold border-b-2 transition-all ${activeTab === "HEADER_TOP" ? "border-[#0098b0] text-[#0098b0] bg-cyan-50/30" : "border-transparent text-slate-400 hover:text-slate-600"}`}
            >
              Header Banners
            </button>
            <button 
              onClick={() => setActiveTab("BELOW_HERO")}
              className={`px-8 py-5 text-sm font-bold border-b-2 transition-all ${activeTab === "BELOW_HERO" ? "border-[#0098b0] text-[#0098b0] bg-cyan-50/30" : "border-transparent text-slate-400 hover:text-slate-600"}`}
            >
              Middle Banners
            </button>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-[#0098b0]" size={40} /></div>
            ) : (
              <div className="space-y-4">
                {filteredBanners.length === 0 && (
                  <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
                    <p className="text-slate-400 font-medium">No slides configured for this slot.</p>
                  </div>
                )}
                {filteredBanners.map((banner) => (
                  <div key={banner.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-[#0098b0] transition-colors">
                    <div className="text-slate-300 group-hover:text-[#0098b0]"><GripVertical size={20} /></div>
                    <div className="flex-1 flex flex-col md:flex-row items-center gap-6">
                      <div className="flex gap-2">
                        <div className="relative w-32 aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                          <img src={banner.imageUrlDesktop} className="w-full h-full object-cover" />
                          <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 rounded uppercase font-bold">Desktop</div>
                        </div>
                        {banner.imageUrlMobile && (
                          <div className="relative w-12 aspect-[9/16] bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                            <img src={banner.imageUrlMobile} className="w-full h-full object-cover" />
                            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[6px] px-0.5 rounded uppercase font-bold">Mobile</div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">{banner.name}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <ExternalLink size={12} /> {banner.targetUrl || "No Link"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(banner)} className="p-2.5 rounded-xl hover:bg-cyan-50 text-slate-400 hover:text-[#0098b0] transition-colors"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(banner.id)} className="p-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingBanner ? "Edit Slide" : "Add New Slide"}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-white rounded-full transition-all">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Slide Name</label>
                <input 
                  type="text" 
                  className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-[#0098b0] font-medium text-slate-900" 
                  placeholder="e.g. Promo Ramadhan 2024"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Monitor size={18} /> Desktop Version
                  </label>
                  <div 
                    onClick={() => openMediaSelector("desktop")}
                    className="aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#0098b0] hover:bg-cyan-50/30 transition-all overflow-hidden relative group"
                  >
                    {imageUrlDesktop ? (
                      <>
                        <img src={imageUrlDesktop} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <Plus className="text-white" size={32} />
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon size={32} className="text-slate-300 mb-2" />
                        <p className="text-[10px] font-bold text-slate-400">SELECT IMAGE</p>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 italic">Recommended: 1200x300px (Header) / 1200x200px (Middle)</p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Smartphone size={18} /> Mobile Version
                  </label>
                  <div 
                    onClick={() => openMediaSelector("mobile")}
                    className="aspect-video md:aspect-[4/5] rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#0098b0] hover:bg-cyan-50/30 transition-all overflow-hidden relative group"
                  >
                    {imageUrlMobile ? (
                      <>
                        <img src={imageUrlMobile} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <Plus className="text-white" size={32} />
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon size={32} className="text-slate-300 mb-2" />
                        <p className="text-[10px] font-bold text-slate-400">SELECT IMAGE</p>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 italic">Recommended: 600x400px</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Target Link (URL)</label>
                  <input 
                    type="url" 
                    className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-[#0098b0] font-medium text-slate-900" 
                    placeholder="https://example.com/promo"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Display Order</label>
                  <input 
                    type="number" 
                    className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-[#0098b0] font-medium text-slate-900" 
                    value={order || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setOrder(isNaN(val) ? 0 : val);
                    }}
                  />
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full bg-[#103174] text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3"
                >
                  <CheckCircle2 size={24} />
                  {editingBanner ? "Update Slide Configuration" : "Save and Add to Slider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MediaSelector 
        isOpen={isMediaOpen} 
        onClose={() => setIsMediaOpen(false)} 
        onSelect={handleMediaSelect} 
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </MainLayout>
  );
}
