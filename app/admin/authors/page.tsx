"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { apiFetch } from "@/lib/api";
import { 
  Plus, 
  Search, 
  Users, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy, 
  Check, 
  MessageCircle,
  X,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { format } from "date-fns";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newCredentials, setNewCredentials] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Health Writer");
  const [bio, setBio] = useState("");

  useEffect(() => {
    fetchAuthors();
  }, []);

  async function fetchAuthors() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/authors");
      setAuthors(res.data);
    } catch (err) {
      console.error("Failed to fetch authors", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/authors", {
        method: "POST",
        body: JSON.stringify({ name, email, role, bio }),
      });
      
      setNewCredentials(res.data.credentials);
      setNewCredentials((prev: any) => ({ ...prev, name: res.data.author.name }));
      setShowSuccess(true);
      setShowForm(false);
      fetchAuthors();
      
      // Reset form
      setName("");
      setEmail("");
      setRole("Health Writer");
      setBio("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text = `Halo ${newCredentials.name},\n\nBerikut adalah kredensial akun Penulis (Author) Anda untuk CMS Kita-Sehat.id:\n\nEmail: ${newCredentials.email}\nPassword: ${newCredentials.password}\n\nSilakan login di: http://localhost:3002/admin/login\n\nHarap simpan kredensial ini dengan aman.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Authors Management</h1>
            <p className="text-slate-500">Manage writers and editorial contributors.</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 bg-[#0098b0] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#007a8d] transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus size={20} />
            Register New Author
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Author List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search authors..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-[#0098b0]" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    <th className="px-6 py-4">Author Profile</th>
                    <th className="px-6 py-4 text-center">Articles</th>
                    <th className="px-6 py-4">Last Login</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading && !authors.length ? (
                    <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400 animate-pulse">Loading contributors...</td></tr>
                  ) : (
                    authors.map((author: any) => (
                      <tr key={author.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                              <img src={author.avatarUrl || `https://ui-avatars.com/api/?name=${author.name}&background=random`} alt={author.name} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{author.name}</p>
                              <p className="text-xs text-slate-500">{author.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-700">
                          {author._count?.articles || 0}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-600 font-medium">
                            {author.lastLoginAt ? format(new Date(author.lastLoginAt), "MMM dd, HH:mm") : "Never"}
                          </p>
                          <span className="text-[10px] text-slate-400">Activity</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-[#0098b0] transition-all">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="space-y-6">
            <div className="bg-[#103174] p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
              <ShieldCheck className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10" />
              <h3 className="text-xl font-bold mb-2">Writer Security</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Setiap penulis mendapatkan kredensial unik. Pastikan mereka menggunakan password yang aman dan tidak membagikannya ke orang lain.
              </p>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20">
                <UserCheck className="text-[#0098b0]" />
                <div>
                  <p className="text-xs font-bold">Active Contributors</p>
                  <p className="text-2xl font-bold">{authors.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Author Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">Register New Contributor</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 focus:border-[#0098b0] outline-none transition-all text-slate-900 font-medium" 
                  placeholder="e.g. Dr. Siti Rahma"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 focus:border-[#0098b0] outline-none transition-all text-slate-900 font-medium" 
                  placeholder="siti@kita-sehat.id"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Author Role</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 focus:border-[#0098b0] outline-none transition-all text-slate-900 font-medium"
                >
                  <option>Health Writer</option>
                  <option>Medical Consultant</option>
                  <option>Guest Blogger</option>
                  <option>Chief Editor</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#0098b0] text-white p-4 rounded-2xl font-bold hover:bg-[#007a8d] transition-all shadow-xl shadow-cyan-500/20 disabled:opacity-50"
              >
                {loading ? "Generating Credentials..." : "Create Author & Generate Password"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal with Credentials */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden text-center p-10 animate-in fade-in zoom-in duration-300">
            <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Author Created!</h2>
            <p className="text-slate-500 mb-8">Salin kredensial di bawah ini untuk dibagikan ke penulis melalui WhatsApp.</p>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-4 mb-8">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Account</p>
                <p className="font-bold text-slate-800">{newCredentials.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Generated Password</p>
                <p className="font-mono text-lg font-bold text-[#103174] tracking-wider">{newCredentials.password}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center gap-3 bg-[#0f172a] text-white p-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? "Copied to Clipboard!" : "Copy WhatsApp Text"}
              </button>
              <button 
                onClick={() => setShowSuccess(false)}
                className="w-full p-4 text-slate-400 font-bold hover:text-slate-600 transition-all"
              >
                Done, close this
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
