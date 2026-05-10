"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { apiFetch } from "@/lib/api";
import { 
  User, 
  Lock, 
  Mail, 
  Camera, 
  CheckCircle2, 
  ShieldCheck,
  Save,
  Loader2
} from "lucide-react";
import MediaSelector from "@/components/media/MediaSelector";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Media Selector State
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleMediaSelect = (url: string) => {
    setAvatarUrl(url);
    setIsMediaOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4003"}/api/admin/media/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      if (data.success) {
        let finalUrl = data.data.url;
        if (finalUrl && !finalUrl.startsWith("http")) {
          finalUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4003") + finalUrl;
        }
        setAvatarUrl(finalUrl);
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  async function fetchProfile() {
    try {
      const res = await apiFetch("/api/admin/profile");
      if (res.data) {
        setUser(res.data);
        setName(res.data.name || "");
        setEmail(res.data.email || "");
        
        let initialAvatar = res.data.avatarUrl || "";
        if (initialAvatar && !initialAvatar.startsWith("http")) {
          initialAvatar = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4003") + initialAvatar;
        }
        setAvatarUrl(initialAvatar);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");

    if (password && password !== confirmPassword) {
      alert("Passwords do not match");
      setSaving(false);
      return;
    }

    try {
      const body: any = { name, email, avatarUrl };
      if (password) body.password = password;

      const res = await apiFetch("/api/admin/profile", {
        method: "PATCH",
        body: JSON.stringify(body),
      });

      // Update local storage too
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, ...res.data }));
      
      setSuccess("Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-[#0098b0]" size={40} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-slate-500">Manage your profile information and security settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Profile Card */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
              <div className="relative inline-block mb-6">
                <div className="h-24 w-24 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden mx-auto relative group">
                  <img src={avatarUrl || `https://ui-avatars.com/api/?name=${name}&background=random`} alt={name} className="w-full h-full object-cover" />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="animate-spin text-white" size={24} />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-[#0098b0] text-white rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <Camera size={16} />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              <h2 className="font-bold text-slate-900 text-lg">{user?.name}</h2>
              <p className="text-sm text-slate-500 font-medium mb-4">{user?.role}</p>
              
              <button 
                type="button"
                onClick={() => setIsMediaOpen(true)}
                className="text-[10px] font-black text-[#0098b0] uppercase tracking-widest hover:underline mb-6 block mx-auto"
              >
                Atau pilih dari Library
              </button>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                <ShieldCheck size={12} /> Verified Account
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <form onSubmit={handleUpdateProfile} className="p-10 space-y-8">
              {success && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 size={20} />
                  <span className="font-bold">{success}</span>
                </div>
              )}

              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-4">
                  <User size={20} className="text-[#0098b0]" /> Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#0098b0] outline-none transition-all font-bold text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#0098b0] outline-none transition-all font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-4">
                  <Lock size={20} className="text-[#0098b0]" /> Security & Password
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="password" 
                        placeholder="Leave blank to keep current"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#0098b0] outline-none transition-all font-bold text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="password" 
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#0098b0] outline-none transition-all font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  disabled={saving}
                  className="w-full bg-[#103174] text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" /> : <Save size={24} />}
                  Update Profile & Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <MediaSelector 
        isOpen={isMediaOpen} 
        onClose={() => setIsMediaOpen(false)} 
        onSelect={handleMediaSelect} 
      />
    </MainLayout>
  );
}
