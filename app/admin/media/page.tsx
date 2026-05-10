"use client";

import { useEffect, useState, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { apiFetch } from "@/lib/api";
import { 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  X, 
  Check, 
  Copy, 
  Trash2, 
  Search,
  Grid,
  List,
  ExternalLink,
  Plus
} from "lucide-react";
import { format } from "date-fns";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4003";

export default function MediaPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState<"file" | "url">("file");
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/media");
      setAssets(res.data);
    } catch (err) {
      console.error("Failed to fetch media", err);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      await fetch(`${API_URL}/api/admin/media/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      fetchMedia();
      setShowUpload(false);
    } catch (err) {
      alert("Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const handleUrlFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    setFetchingUrl(true);
    try {
      await apiFetch("/api/admin/media/fetch-url", {
        method: "POST",
        body: JSON.stringify({ url: urlInput }),
      });
      setUrlInput("");
      fetchMedia();
      setShowUpload(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setFetchingUrl(false);
    }
  };

  const copyUrl = (url: string, id: string) => {
    const fullUrl = `${API_URL}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteAsset = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset? This action cannot be undone.")) return;
    
    setLoading(true);
    try {
      await apiFetch(`/api/admin/media/${id}`, { method: "DELETE" });
      setSelectedAsset(null);
      fetchMedia();
    } catch (err) {
      alert("Failed to delete asset");
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    if (!confirm("This will remove all database records that point to non-existent files. Continue?")) return;
    
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/media/cleanup", { method: "POST" });
      alert(`Cleanup successful! Removed ${res.data.deletedCount} broken assets.`);
      fetchMedia();
    } catch (err) {
      alert("Failed to cleanup library");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
            <p className="text-slate-500">Manage your images and assets for Kita-Sehat articles.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { setUploadType("file"); setShowUpload(true); }}
              className="flex items-center justify-center gap-2 bg-[#0098b0] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#007a8d] transition-all shadow-lg shadow-cyan-500/20"
            >
              <Upload size={18} />
              Upload Files
            </button>
            <button 
              onClick={() => { setUploadType("url"); setShowUpload(true); }}
              className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              <LinkIcon size={18} />
              Fetch from URL
            </button>
            <button 
              onClick={handleCleanup}
              className="flex items-center justify-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-6 py-2.5 rounded-xl font-bold hover:bg-amber-100 transition-all shadow-sm"
            >
              <Trash2 size={18} />
              Clean Up
            </button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search media by name..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#0098b0]" />
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-[#0098b0] bg-white rounded-lg shadow-sm border border-slate-100"><Grid size={18} /></button>
              <button className="p-2 text-slate-400 hover:text-slate-600"><List size={18} /></button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {loading && assets.length === 0 ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-slate-50 rounded-2xl animate-pulse border border-slate-100"></div>
                ))
              ) : (
                assets.map((asset) => (
                  <div 
                    key={asset.id} 
                    onClick={() => setSelectedAsset(asset)}
                    className={`group relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedAsset?.id === asset.id ? "border-[#0098b0] shadow-xl" : "border-slate-100 hover:border-[#0098b0]/50"
                    }`}
                  >
                    <img 
                      src={`${API_URL}${asset.url}`} 
                      alt={asset.altText} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Broken+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); copyUrl(asset.url, asset.id); }}
                        className="p-2 bg-white/90 backdrop-blur rounded-lg text-slate-700 shadow-lg hover:bg-white transition-colors"
                        title="Copy Link"
                      >
                        {copiedId === asset.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteAsset(asset.id); }}
                        className="p-2 bg-red-500/90 backdrop-blur rounded-lg text-white shadow-lg hover:bg-red-600 transition-colors"
                        title="Delete Media"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Asset Detail Overlay (Side Panel) */}
        {selectedAsset && (
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 border-l border-slate-100 animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Media Details</h3>
                <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-white rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                  <img src={`${API_URL}${selectedAsset.url}`} className="w-full h-full object-contain bg-slate-50" />
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">File Path</p>
                    <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-xs font-mono text-slate-600 truncate flex-1">{selectedAsset.url}</p>
                      <button onClick={() => copyUrl(selectedAsset.url, 'side')} className="text-[#0098b0]"><Copy size={14} /></button>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Alt Text</p>
                    <input type="text" className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm text-slate-900" defaultValue={selectedAsset.altText} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Uploaded At</p>
                      <p className="text-sm font-semibold text-slate-700">{format(new Date(selectedAsset.createdAt), "MMM dd, yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Type</p>
                      <p className="text-sm font-semibold text-slate-700 uppercase">{selectedAsset.type}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                <button 
                  onClick={() => setLightboxUrl(`${API_URL}${selectedAsset.url}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  <ExternalLink size={18} /> View Full
                </button>
                <button 
                  onClick={() => handleDeleteAsset(selectedAsset.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-all"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800">
                  {uploadType === "file" ? "Upload Media" : "Fetch from URL"}
                </h2>
                <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-white rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8">
                {uploadType === "file" ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-[#0098b0] hover:bg-cyan-50/50 transition-all cursor-pointer group"
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                    <div className="h-16 w-16 bg-cyan-100 text-[#0098b0] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all">
                      <Upload size={32} />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">Drop your files here</h3>
                    <p className="text-slate-400 text-sm">or click to browse from computer</p>
                  </div>
                ) : (
                  <form onSubmit={handleUrlFetch} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Paste Image URL</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          type="url" 
                          placeholder="https://example.com/image.jpg"
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-[#0098b0] outline-none font-medium text-slate-900"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={fetchingUrl}
                      className="w-full bg-[#0098b0] text-white p-4 rounded-2xl font-bold hover:bg-[#007a8d] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {fetchingUrl ? "Downloading..." : "Fetch & Save to Library"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Lightbox Modal */}
        {lightboxUrl && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
            <button 
              onClick={() => setLightboxUrl(null)}
              className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all group"
            >
              <X size={32} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={lightboxUrl} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-black/50 border border-white/10 animate-in zoom-in-95 duration-500" 
                alt="Full View" 
              />
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </MainLayout>
  );
}
