"use client";

import React, { useState, useRef } from "react";
import { Info, Upload, Save, CheckCircle, Trash2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { apiFetch } from "@/lib/api";

interface FounderData {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const FounderForm = ({ 
  id, 
  data, 
  onChange, 
  onImageChange 
}: { 
  id: number, 
  data: FounderData, 
  onChange: (field: keyof FounderData, value: string) => void,
  onImageChange: (image: string) => void
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-bold text-slate-800">Founder {id}: {data.name || "Unnamed"}</h2>
        <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">Profile {id}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Photo Section */}
        <div className="md:col-span-1 space-y-3">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight">Founder Photo</label>
          <div 
            onClick={handleImageClick}
            className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer hover:border-[#0098b0] transition-all"
          >
            {data.image ? (
              <>
                <img src={data.image} alt={data.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white text-xs font-bold">
                  Change Photo
                </div>
              </>
            ) : (
              <div className="text-slate-400 flex flex-col items-center p-4 text-center">
                <Upload size={32} />
                <span className="text-xs mt-2 font-medium">Click to upload photo</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
          {data.image && (
            <button 
              onClick={() => onImageChange("")}
              className="flex items-center justify-center gap-2 w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 size={14} />
              Remove Photo
            </button>
          )}
          <p className="text-[10px] text-slate-400 leading-tight text-center">Recommended: Square (800x800px). JPG/PNG/WebP.</p>
        </div>

        {/* Info Section */}
        <div className="md:col-span-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={data.name}
                onChange={(e) => onChange("name", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0098b0] focus:border-transparent outline-none transition-all text-slate-800"
                placeholder="Enter full name..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Title / Role</label>
              <input 
                type="text" 
                value={data.role}
                onChange={(e) => onChange("role", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0098b0] focus:border-transparent outline-none transition-all text-slate-800"
                placeholder="Enter role (e.g. CEO)..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Biography</label>
            <textarea 
              rows={6}
              value={data.bio}
              onChange={(e) => onChange("bio", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0098b0] focus:border-transparent outline-none transition-all text-slate-800 text-sm leading-relaxed"
              placeholder="Write biography..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AboutUsAdminPage() {
  const [founder1, setFounder1] = useState<FounderData>({
    name: "Nanang Ahmad Suryana",
    role: "Direktur Utama KITA-SEHAT.id",
    bio: "Nanang Ahmad Suryana adalah seorang Creative Consultant dengan pengalaman lebih dari 10 tahun di industri media dan pengembangan brand. Memiliki keahlian dalam digital asset management, creative branding, serta pengembangan identitas visual perusahaan, ia telah berkontribusi dalam membangun dan memperkuat berbagai brand di sejumlah perusahaan.\n\nDi bidang media kreatif, Nanang dikenal memiliki kemampuan art direction yang kuat dan visioner. Salah satu pencapaian terbaiknya adalah meraih penghargaan The Best Cover Magazine of The Year pada tahun 2016.",
    image: "" 
  });

  const [founder2, setFounder2] = useState<FounderData>({
    name: "Emmy R. Sidabutar",
    role: "Creative Consultant",
    bio: "Emmy R. Sidabutar adalah seorang Creative Consultant dengan pengalaman lebih dari 15 tahun di industri media, marketing, dan agency periklanan. Memiliki kompetensi kuat dalam strategi komunikasi brand, media marketing, serta brand activation, ia telah berpengalaman menangani berbagai kampanye kreatif untuk sejumlah brand ternama.\n\nDengan pemahaman mendalam terhadap perilaku pasar dan komunikasi visual, Emmy dikenal mampu menghadirkan konsep pemasaran yang inovatif, efektif, dan relevan dengan perkembangan industri modern.",
    image: ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await apiFetch("/api/settings");
        if (data.success) {
          const s = data.data;
          if (s.about_founder1_name) {
            setFounder1({
              name: s.about_founder1_name || "",
              role: s.about_founder1_role || "",
              bio: s.about_founder1_bio || "",
              image: s.about_founder1_image || ""
            });
          }
          if (s.about_founder2_name) {
            setFounder2({
              name: s.about_founder2_name || "",
              role: s.about_founder2_role || "",
              bio: s.about_founder2_bio || "",
              image: s.about_founder2_image || ""
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    try {
      const data = await apiFetch("/api/settings", {
        method: "POST",
        body: JSON.stringify({
          settings: {
            about_founder1_name: founder1.name,
            about_founder1_role: founder1.role,
            about_founder1_bio: founder1.bio,
            about_founder1_image: founder1.image,
            about_founder2_name: founder2.name,
            about_founder2_role: founder2.role,
            about_founder2_bio: founder2.bio,
            about_founder2_image: founder2.image,
          }
        })
      });

      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setError(data.message || "Failed to save settings");
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0098b0]"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-[#0098b0]/10 text-[#0098b0] rounded-2xl flex items-center justify-center shrink-0">
              <Info size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">About Us Management</h1>
              <p className="text-slate-500 text-xs font-medium">Update company information and founder profiles.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showSuccess && (
              <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 border border-green-100 px-4 py-2.5 rounded-xl animate-in fade-in slide-in-from-right-4">
                <CheckCircle size={18} />
                Changes Saved
              </div>
            )}
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 bg-[#0098b0] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#007a8d] transition-all shadow-lg shadow-[#0098b0]/20 disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px] justify-center`}
            >
              {isSaving ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <Info size={20} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          {/* Founder 1 Form */}
          <FounderForm 
            id={1} 
            data={founder1} 
            onChange={(f, v) => setFounder1({...founder1, [f]: v})} 
            onImageChange={(img) => setFounder1({...founder1, image: img})}
          />
          
          {/* Founder 2 Form */}
          <FounderForm 
            id={2} 
            data={founder2} 
            onChange={(f, v) => setFounder2({...founder2, [f]: v})} 
            onImageChange={(img) => setFounder2({...founder2, image: img})}
          />
        </div>

        {/* Global Settings */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="h-8 w-8 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center">
               <Info size={18} />
            </div>
            General Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
               <div>
                 <p className="font-bold text-slate-800">Public Visibility</p>
                 <p className="text-xs text-slate-500 font-medium mt-0.5">Show the About Us page on the main website.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" className="sr-only peer" defaultChecked />
                 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0098b0]"></div>
               </label>
             </div>
             
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
               <div>
                 <p className="font-bold text-slate-800">SEO Indexing</p>
                 <p className="text-xs text-slate-500 font-medium mt-0.5">Allow search engines to index this page.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" className="sr-only peer" />
                 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0098b0]"></div>
               </label>
             </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
