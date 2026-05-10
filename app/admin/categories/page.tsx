"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { apiFetch } from "@/lib/api";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Layers,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Save,
  X
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#0098b0");
  const [order, setOrder] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
    setColor(category.color || "#0098b0");
    setOrder(category.order || 0);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setColor("#0098b0");
    setOrder(0);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await apiFetch(`/api/admin/categories/${editingCategory.id}`, {
          method: "PATCH",
          body: JSON.stringify({ name, description, color, order }),
        });
      } else {
        await apiFetch("/api/admin/categories", {
          method: "POST",
          body: JSON.stringify({ name, description, color, order }),
        });
      }
      fetchCategories();
      resetForm();
    } catch (err) {
      alert("Failed to save category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await apiFetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
            <p className="text-slate-500">Organize your health content into logical sections.</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 bg-[#0098b0] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#007a8d] transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus size={20} />
            Add New Category
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category List Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Category Name</th>
                    <th className="px-6 py-4">Articles</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-6 py-4 h-16 bg-slate-50/50"></td>
                      </tr>
                    ))
                  ) : (
                    categories.map((cat: any) => (
                      <tr key={cat.id} className="hover:bg-slate-50 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: cat.color || "#0098b0" }}
                            ></div>
                            <div>
                              <p className="font-bold text-slate-800">{cat.name}</p>
                              <p className="text-xs text-slate-400">{cat.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-600">{cat._count?.articles || 0}</span>
                          <span className="text-xs text-slate-400 ml-1">posts</span>
                        </td>
                        <td className="px-6 py-4">
                          {cat.isActive ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                              <CheckCircle2 size={12} /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                              <XCircle size={12} /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(cat)}
                              className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(cat.id)}
                              className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add/Edit Form Sidebar */}
          <div className={`lg:col-span-1 space-y-6 ${!showForm && "hidden lg:block"}`}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                {showForm && (
                  <button onClick={resetForm} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
                    <X size={20} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Category Name</label>
                  <input 
                    type="text" 
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 outline-none focus:border-[#0098b0] focus:ring-2 focus:ring-[#0098b0]/10"
                    placeholder="e.g. Nutrisi Keluarga"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Description</label>
                  <textarea 
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 outline-none focus:border-[#0098b0] focus:ring-2 focus:ring-[#0098b0]/10 resize-none h-24"
                    placeholder="Describe this category..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Brand Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        className="w-10 h-10 rounded-lg border-none cursor-pointer"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                      />
                      <span className="text-xs font-mono text-slate-500 uppercase">{color}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Display Order</label>
                    <input 
                      type="number" 
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 outline-none focus:border-[#0098b0]"
                      value={order}
                      onChange={(e) => setOrder(parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="submit"
                    className="flex-1 bg-[#0098b0] text-white py-3 rounded-xl font-bold hover:bg-[#007a8d] transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    <Save size={18} />
                    {editingCategory ? "Update" : "Save Category"}
                  </button>
                  {editingCategory && (
                    <button 
                      type="button"
                      onClick={resetForm}
                      className="px-4 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-[#103174] text-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold mb-2">Category Insights</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Categories help readers find relevant health topics quickly. Ensure names are clear and descriptive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
