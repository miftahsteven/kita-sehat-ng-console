"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { apiFetch } from "@/lib/api";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock,
  Archive,
  LayoutDashboard,
  Star
} from "lucide-react";
import { format } from "date-fns";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const res = await apiFetch(`/api/admin/articles?page=${page}&search=${searchTerm}`);
        setArticles(res.data);
        setMeta(res.meta);
      } catch (err) {
        console.error("Failed to fetch articles", err);
      } finally {
        setLoading(false);
      }
    }
    
    // Debounce search
    const timer = setTimeout(() => {
      fetchArticles();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [page, searchTerm]);

  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const getImageUrl = (url: string) => {
    if (!url) return "https://placehold.co/100x60";
    if (url.startsWith("http")) return url;
    const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4003").replace(/\/$/, "");
    const safeUrl = url.startsWith("/") ? url : `/${url}`;
    return `${API_BASE}${safeUrl}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider"><CheckCircle2 size={12} /> Published</span>;
      case "DRAFT":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-500 border border-slate-200 uppercase tracking-wider"><Clock size={12} /> Draft</span>;
      case "ARCHIVED":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wider"><Archive size={12} /> Archived</span>;
      default:
        return status;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;
    try {
      await apiFetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      setArticles(articles.filter((a: any) => a.id !== id));
    } catch (err) {
      alert("Gagal menghapus artikel");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Articles</h1>
            <p className="text-slate-500">Manage your health posts and editorial content.</p>
          </div>
          <a 
            href="/admin/articles/new"
            className="flex items-center justify-center gap-2 bg-[#0098b0] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#007a8d] transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus size={20} />
            Write New Post
          </a>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search articles by title..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-[#0098b0]/20 focus:border-[#0098b0] transition-all text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-medium">
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Article Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Article</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Stats</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4 h-20 bg-slate-50/50"></td>
                    </tr>
                  ))
                ) : (
                  articles.map((article: any) => (
                    <tr key={article.id} className="hover:bg-slate-50 group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img 
                              src={getImageUrl(article.coverImage)} 
                              alt={article.title} 
                              className="h-12 w-20 object-cover rounded-lg shadow-sm"
                            />
                            {(article.isHero || article.isFeatured) && (
                              <div className="absolute -top-2 -left-2 flex gap-1">
                                {article.isHero && <span className="w-5 h-5 bg-[#0098b0] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white" title="Hero Slider"><LayoutDashboard size={10} /></span>}
                                {article.isFeatured && <span className="w-5 h-5 bg-amber-400 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white" title="Featured"><Star size={10} fill="currentColor" /></span>}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 line-clamp-1 group-hover:text-[#0098b0] transition-colors">{article.title}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              <span className="font-semibold text-slate-700">{article.category?.name || "Uncategorized"}</span> • By {article.author?.name || "Unknown Author"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {getStatusBadge(article.status)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                            <Eye size={14} />
                            <span className="text-sm">{article.viewCount.toLocaleString()}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">Views</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-slate-600 font-medium">
                          {article.publishedAt ? format(new Date(article.publishedAt), "MMM dd, yyyy") : "-"}
                        </div>
                        <div className="text-[10px] text-slate-400">Published</div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a 
                            href={`/admin/articles/${article.id}`}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" 
                            title="Edit"
                          >
                            <Edit size={16} />
                          </a>
                          <button 
                            onClick={() => handleDelete(article.id)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors" 
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                          <a 
                            href={`/artikel/${article.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors" 
                            title="View Site"
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-sm text-slate-500 font-medium">
              Showing {meta ? Math.min((page - 1) * meta.limit + 1, meta.total) : 0} to {meta ? Math.min(page * meta.limit, meta.total) : 0} of {meta?.total || 0} articles
            </span>
            <div className="flex gap-2">
              <button 
                disabled={!meta?.hasPreviousPage || loading} 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 disabled:opacity-30 disabled:bg-slate-100 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-[#0098b0] hover:text-[#0098b0] transition-all shadow-sm"
              >
                Previous
              </button>
              <button 
                disabled={!meta?.hasNextPage || loading} 
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 disabled:opacity-30 disabled:bg-slate-100 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-[#0098b0] hover:text-[#0098b0] transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
