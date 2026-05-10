"use client";

import { useEffect, useState, use } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ArticleForm from "@/components/articles/ArticleForm";
import { apiFetch } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: Props) {
  const { id } = use(params);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await apiFetch(`/api/admin/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        setError("Gagal mengambil data artikel");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-10 h-10 text-[#0098b0] animate-spin" />
          <p className="text-slate-500 font-medium">Memuat data artikel...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !article) {
    return (
      <MainLayout>
        <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center max-w-lg mx-auto mt-10">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 font-bold text-2xl">!</div>
          <h2 className="text-xl font-bold text-red-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-red-600 mb-6">{error || "Artikel tidak ditemukan"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
          >
            Coba Lagi
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ArticleForm initialData={article} isEdit={true} />
    </MainLayout>
  );
}
