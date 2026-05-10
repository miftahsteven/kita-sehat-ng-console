"use client";

import { useState, useEffect } from "react";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { 
  Save, 
  Send, 
  Image as ImageIcon, 
  Settings, 
  Eye,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  LayoutDashboard,
  Star,
  Award
} from "lucide-react";

import MediaSelector from "@/components/media/MediaSelector";

interface ArticleFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function ArticleForm({ initialData, isEdit = false }: ArticleFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [status, setStatus] = useState(initialData?.status || "DRAFT");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [categories, setCategories] = useState([]);
  const [authorId, setAuthorId] = useState(initialData?.authorId || "");
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  
  // New fields
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [isHero, setIsHero] = useState(initialData?.isHero || false);
  const [isEditorPick, setIsEditorPick] = useState(initialData?.isEditorPick || false);
  
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, authRes] = await Promise.all([
          apiFetch("/api/admin/categories"),
          apiFetch("/api/admin/authors")
        ]);
        setCategories(catRes.data);
        setAuthors(authRes.data);
        
        if (!isEdit && authRes.data.length > 0 && !authorId) {
          setAuthorId(authRes.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    }
    fetchData();
  }, [isEdit, authorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return alert("Pilih kategori terlebih dahulu!");
    if (!authorId) return alert("Pilih penulis terlebih dahulu!");

    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/articles/${initialData.id}` : "/api/admin/articles";
      const method = isEdit ? "PUT" : "POST";
      
      await apiFetch(url, {
        method,
        body: JSON.stringify({
          title,
          excerpt,
          content,
          status,
          categoryId,
          coverImage,
          authorId,
          isFeatured,
          isHero,
          isEditorPick,
        }),
      });
      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      alert("Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4 sticky top-0 bg-[#f8fafc] py-4 z-10 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-200 rounded-full transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isEdit ? "Edit Artikel" : "Tambah Artikel Baru"}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {isEdit ? "Perbarui konten artikel Anda" : "Buat dan publikasikan artikel berita kesehatan"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Eye size={18} />
            Preview
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#0098b0] text-white text-sm font-bold hover:bg-[#007a8d] transition-all shadow-lg shadow-cyan-500/20"
          >
            <Send size={18} />
            {loading ? "Saving..." : isEdit ? "Update Artikel" : "Publikasikan"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <input 
              type="text" 
              placeholder="Judul artikel..." 
              className="w-full text-4xl font-extrabold text-slate-900 outline-none placeholder:text-slate-400 border-none p-0 focus:ring-0"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            
            <textarea 
              placeholder="Ringkasan/excerpt artikel (untuk preview di listing)..." 
              className="w-full text-lg text-slate-900 outline-none placeholder:text-slate-400 border-none p-0 resize-none h-20 font-medium focus:ring-0"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
            />

            <div className="h-px bg-slate-100"></div>

            <TiptapEditor content={content} onChange={setContent} />
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Settings size={18} className="text-[#0098b0]" />
              SEO & Meta Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">SEO Title</label>
                <input type="text" className="w-full rounded-lg border border-slate-200 p-2.5 text-sm text-slate-900 outline-none focus:border-[#0098b0]" placeholder="Judul untuk Google Search" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Focus Keywords</label>
                <input type="text" className="w-full rounded-lg border border-slate-200 p-2.5 text-sm text-slate-900 outline-none focus:border-[#0098b0]" placeholder="kesehatan, nutrisi, dll" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Publish Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">Publikasi</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm text-slate-900 outline-none font-medium focus:border-[#0098b0]"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              {/* Special Flags */}
              <div className="pt-4 space-y-3 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-6 rounded-full transition-all relative ${isHero ? 'bg-[#0098b0]' : 'bg-slate-200'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isHero}
                      onChange={(e) => setIsHero(e.target.checked)}
                    />
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isHero ? 'left-5' : 'left-1'}`}></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                      <LayoutDashboard size={14} className="text-slate-400" />
                      Hero Slider
                    </span>
                    <span className="text-[10px] text-slate-400">Tampilkan di slider utama</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-6 rounded-full transition-all relative ${isFeatured ? 'bg-amber-400' : 'bg-slate-200'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                    />
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isFeatured ? 'left-5' : 'left-1'}`}></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                      <Star size={14} className="text-slate-400" />
                      Highlighted
                    </span>
                    <span className="text-[10px] text-slate-400">Tandai sebagai artikel utama</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-6 rounded-full transition-all relative ${isEditorPick ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isEditorPick}
                      onChange={(e) => setIsEditorPick(e.target.checked)}
                    />
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isEditorPick ? 'left-5' : 'left-1'}`}></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                      <Award size={14} className="text-slate-400" />
                      Editor Picks
                    </span>
                    <span className="text-[10px] text-slate-400">Pilihan redaksi kita sehat</span>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button 
                  type="submit"
                  className="w-full bg-[#103174] text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20"
                >
                  {isEdit ? "Update Artikel" : "Publikasikan"}
                </button>
              </div>
            </div>
          </div>

          {/* Category Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">Kategori</h3>
            </div>
            <div className="p-6">
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {categories.map((cat: any) => (
                  <label key={cat.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-all">
                    <input 
                      type="radio" 
                      name="category" 
                      value={cat.id} 
                      checked={categoryId === cat.id}
                      onChange={() => setCategoryId(cat.id)}
                      className="w-4 h-4 text-[#0098b0] focus:ring-[#0098b0] border-slate-300" 
                    />
                    <span className="text-sm font-medium text-slate-600">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Author Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">Penulis</h3>
            </div>
            <div className="p-6">
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {authors.map((auth: any) => (
                  <label key={auth.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-all">
                    <input 
                      type="radio" 
                      name="author" 
                      value={auth.id} 
                      checked={authorId === auth.id}
                      onChange={() => setAuthorId(auth.id)}
                      className="w-4 h-4 text-[#0098b0] focus:ring-[#0098b0] border-slate-300" 
                    />
                    <span className="text-sm font-medium text-slate-600">{auth.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Media Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">Gambar Sampul</h3>
            </div>
            <div className="p-6">
              {coverImage ? (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden group shadow-sm">
                    <img src={coverImage} className="w-full h-full object-cover" />
                    <div 
                      onClick={() => setIsMediaOpen(true)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <span className="text-white text-xs font-bold bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md">Ganti Gambar</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setIsMediaOpen(true)}
                  className="aspect-video rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-100 hover:border-[#0098b0] transition-all"
                >
                  <ImageIcon size={32} strokeWidth={1.5} />
                  <span className="text-xs font-bold mt-2">Pilih Gambar</span>
                </div>
              )}
              <p className="text-[10px] text-slate-400 mt-3 italic leading-relaxed text-center">Format: JPG, PNG, WEBP. Maks: 2MB</p>
            </div>
          </div>
        </div>
      </div>
    </form>
      <MediaSelector 
        isOpen={isMediaOpen} 
        onClose={() => setIsMediaOpen(false)} 
        onSelect={(url) => setCoverImage(url)} 
      />
    </>
  );
}
