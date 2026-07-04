"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { apiFetch } from "@/lib/api";
import { 
  Search, 
  Download, 
  Clock, 
  MessageSquare,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Trash2
} from "lucide-react";
import { format } from "date-fns";

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);
  const [exporting, setExporting] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data feedback ini?")) return;
    try {
      await apiFetch(`/api/admin/feedbacks/${id}`, { method: "DELETE" });
      setFeedbacks(feedbacks.filter((item: any) => item.id !== id));
      if (meta) {
        setMeta({ ...meta, total: meta.total - 1 });
      }
    } catch (err) {
      alert("Gagal menghapus feedback");
    }
  };

  useEffect(() => {
    async function fetchFeedbacks() {
      setLoading(true);
      try {
        const res = await apiFetch(`/api/admin/feedbacks?page=${page}&limit=10&search=${searchTerm}`);
        setFeedbacks(res.data);
        setMeta(res.meta);
      } catch (err) {
        console.error("Failed to fetch feedbacks", err);
      } finally {
        setLoading(false);
      }
    }
    
    // Debounce search
    const timer = setTimeout(() => {
      fetchFeedbacks();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [page, searchTerm]);

  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleExport = async () => {
    setExporting(true);
    try {
      // Fetch all matched feedbacks without pagination limit
      const res = await apiFetch(`/api/admin/feedbacks?export=true&search=${searchTerm}`);
      const dataToExport = res.data || [];

      if (dataToExport.length === 0) {
        alert("Tidak ada data untuk diekspor");
        return;
      }

      // Generate CSV content
      const headers = ["Nama", "No. WhatsApp/HP", "Kategori yang Disukai", "Kategori Lainnya", "Kode Verifikasi 4 Angka", "Artikel Asal", "Tanggal Dibuat"];
      const rows = dataToExport.map((item: any) => [
        item.name,
        item.phone,
        item.categories.join(", "),
        item.otherCategory || "",
        item.verificationCode,
        item.article?.title || "-",
        format(new Date(item.createdAt), "yyyy-MM-dd HH:mm:ss")
      ]);

      // Add UTF-8 BOM so Excel opens it with proper encoding
      const csvContent = "\uFEFF" + [
        headers.join(","),
        ...rows.map((e: any[]) => e.map((val: any) => `"${String(val).replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `export_feedback_kita_sehat_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to export feedbacks", err);
      alert("Gagal melakukan ekspor data");
    } finally {
      setExporting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Feedback List</h1>
            <p className="text-slate-500">Kelola dan cari feedback artikel pengunjung untuk mencocokkan hadiah.</p>
          </div>
          <button 
            onClick={handleExport}
            disabled={exporting || loading}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            {exporting ? (
              <>Mengunduh...</>
            ) : (
              <>
                <FileSpreadsheet size={20} />
                Export to Excel
              </>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari feedback berdasarkan nama, nomor HP, atau 4 digit kode verifikasi..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-[#0098b0]/20 focus:border-[#0098b0] transition-all text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Feedback Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Nama & No. WA</th>
                  <th className="px-6 py-4">Kategori Disukai</th>
                  <th className="px-6 py-4">Kategori Lainnya</th>
                  <th className="px-6 py-4 text-center">Kode Verifikasi</th>
                  <th className="px-6 py-4">Artikel Asal</th>
                  <th className="px-6 py-4">Tanggal Masuk</th>
                  <th className="px-6 py-4 text-right w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={7} className="px-6 py-5 h-20 bg-slate-50/50"></td>
                    </tr>
                  ))
                ) : feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50/20">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <MessageSquare className="w-12 h-12 text-slate-300" />
                        <span>Belum ada data feedback yang ditemukan</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  feedbacks.map((feedback: any) => (
                    <tr key={feedback.id} className="hover:bg-slate-50 group">
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-bold text-slate-800">{feedback.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{feedback.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1 max-w-[250px]">
                          {feedback.categories.length > 0 ? (
                            feedback.categories.map((cat: string, index: number) => (
                              <span key={index} className="inline-block bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">
                                {cat}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">Tidak ada</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-600 max-w-[200px] truncate" title={feedback.otherCategory || ""}>
                          {feedback.otherCategory || <span className="text-slate-400 italic">-</span>}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center justify-center bg-cyan-50 text-[#0098b0] border border-cyan-100 rounded-lg px-3 py-1 text-sm font-extrabold tracking-wider">
                          {feedback.verificationCode}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-slate-700 line-clamp-1 max-w-[220px]" title={feedback.article?.title || ""}>
                          {feedback.article?.title || <span className="text-slate-400 italic">-</span>}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-slate-600 font-medium">
                          {format(new Date(feedback.createdAt), "dd MMM yyyy, HH:mm")}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock size={10} />
                          WIB
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => handleDelete(feedback.id)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer" 
                          title="Hapus Feedback"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && feedbacks.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-sm text-slate-500 font-medium">
                Showing {Math.min((page - 1) * meta.limit + 1, meta.total)} to {Math.min(page * meta.limit, meta.total)} of {meta.total} feedbacks
              </span>
              <div className="flex gap-2">
                <button 
                  disabled={!meta.hasPreviousPage || loading} 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 disabled:opacity-30 disabled:bg-slate-100 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-[#0098b0] hover:text-[#0098b0] transition-all shadow-sm cursor-pointer"
                >
                  Previous
                </button>
                <button 
                  disabled={!meta.hasNextPage || loading} 
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 disabled:opacity-30 disabled:bg-slate-100 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-[#0098b0] hover:text-[#0098b0] transition-all shadow-sm cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
