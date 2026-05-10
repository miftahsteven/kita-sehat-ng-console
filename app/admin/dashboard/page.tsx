"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { apiFetch } from "@/lib/api";
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Eye,
  CheckCircle,
  Loader2,
  Plus,
  ArrowRight,
  Target,
  Zap
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await apiFetch("/api/admin/dashboard/stats");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const stats = data?.stats || {
    totalArticles: 0,
    publishedArticles: 0,
    totalViews: 0,
    totalAuthors: 0,
  };

  const getImageUrl = (url: string) => {
    if (!url) return "https://placehold.co/100x60";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4003"}${url}`;
  };

  const statCards = [
    { label: "Total Articles", value: stats.totalArticles, icon: FileText, color: "text-blue-600", bg: "bg-blue-50", desc: "Total content items" },
    { label: "Published", value: stats.publishedArticles, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", desc: "Live on public site" },
    { label: "Total Views", value: stats.totalViews.toLocaleString(), icon: Eye, color: "text-purple-600", bg: "bg-purple-50", desc: "Across all articles" },
    { label: "Contributors", value: stats.totalAuthors, icon: Users, color: "text-amber-600", bg: "bg-amber-50", desc: "Active writers" },
  ];

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
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pusat Kendali Utama</h1>
            <p className="text-slate-500 mt-1">Pantau performa konten kesehatan Kita-Sehat.id secara real-time.</p>
          </div>
          <button 
            onClick={() => router.push("/admin/articles/new")}
            className="flex items-center justify-center gap-2 bg-[#103174] text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20"
          >
            <Plus size={20} />
            Buat Artikel Baru
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon size={80} />
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={28} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Realtime</span>
                  <div className="h-1 w-8 bg-[#0098b0] rounded-full mt-1"></div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{stat.value}</h3>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-[10px] text-slate-400 font-medium">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Articles */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <Zap className="text-amber-500" size={20} />
                  <h3 className="font-black text-slate-800 text-lg">Artikel Terbaru</h3>
                </div>
                <button onClick={() => router.push("/admin/articles")} className="group flex items-center gap-2 text-xs font-black text-[#0098b0] hover:text-[#007a8d] uppercase tracking-widest transition-all">
                  Lihat Semua <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="p-0">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                      <th className="px-10 py-5">Informasi Artikel</th>
                      <th className="px-10 py-5">Penulis</th>
                      <th className="px-10 py-5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data?.latestArticles.map((article: any) => (
                      <tr key={article.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-20 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
                              <img src={getImageUrl(article.coverImage)} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 line-clamp-1 group-hover:text-[#0098b0] transition-colors">{article.title}</span>
                              <span className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">{article.category.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-slate-200 overflow-hidden">
                              <img src={`https://ui-avatars.com/api/?name=${article.author.name}&background=random`} />
                            </div>
                            <span className="text-xs font-bold text-slate-600">{article.author.name}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${
                            article.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                          }`}>
                            {article.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Achievement / Goal Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#103174] to-[#0098b0] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Target size={200} />
              </div>
              <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                Pencapaian <TrendingUp size={24} />
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-8 font-medium">
                Website Anda telah menjangkau ribuan pembaca setia. Terus tingkatkan kualitas konten kesehatan Anda!
              </p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span>Target Artikel</span>
                    <span>{Math.round((stats.publishedArticles / 50) * 100)}%</span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000" 
                      style={{ width: `${Math.min(100, (stats.publishedArticles / 50) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-blue-200 font-bold italic">Menuju target 50 artikel edukatif.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black uppercase text-blue-200">Total Media</p>
                    <p className="text-2xl font-black">{stats.totalMedia}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black uppercase text-blue-200">Growth</p>
                    <p className="text-2xl font-black">+12%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                Tips Cepat <Zap className="text-[#0098b0]" size={18} />
              </h3>
              <ul className="space-y-4">
                {[
                  "Gunakan gambar Unsplash kualitas tinggi.",
                  "Tambahkan kategori yang relevan.",
                  "Pastikan SEO title menarik pembaca."
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3 text-xs font-bold text-slate-500 leading-relaxed group">
                    <div className="h-2 w-2 rounded-full bg-[#0098b0] mt-1.5 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
