"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { apiFetch } from "@/lib/api";
import { 
  Plus, 
  GripVertical, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Monitor,
  Layout
} from "lucide-react";

export default function MenusPage() {
  const [activeTab, setActiveTab] = useState("HEADER");
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [order, setOrder] = useState(0);

  useEffect(() => {
    fetchMenus();
  }, [activeTab]);

  async function fetchMenus() {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/menus?type=${activeTab}`);
      setMenus(res.data);
    } catch (err) {
      console.error("Failed to fetch menus", err);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setLabel(item.label);
    setUrl(item.url);
    setParentId(item.parentId || null);
    setOrder(item.order);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setLabel("");
    setUrl("");
    setParentId(null);
    setOrder(menus.length);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await apiFetch(`/api/admin/menus/${editingItem.id}`, {
          method: "PATCH",
          body: JSON.stringify({ label, url, order, parentId }),
        });
      } else {
        await apiFetch("/api/admin/menus", {
          method: "POST",
          body: JSON.stringify({ label, url, type: activeTab, order, parentId }),
        });
      }
      fetchMenus();
      resetForm();
    } catch (err) {
      alert("Failed to save menu");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete the menu and all its submenus.")) return;
    try {
      await apiFetch(`/api/admin/menus/${id}`, { method: "DELETE" });
      fetchMenus();
    } catch (err) {
      alert("Failed to delete menu");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Navigation Management</h1>
            <p className="text-slate-500">Customize your site navigation structure in real-time.</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 bg-[#0098b0] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#007a8d] transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus size={20} />
            Add Menu Item
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab("HEADER")}
            className={`px-8 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "HEADER" ? "border-[#0098b0] text-[#0098b0]" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Monitor size={18} />
            Main Header Menu
          </button>
          <button 
            onClick={() => setActiveTab("FOOTER")}
            className={`px-8 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "FOOTER" ? "border-[#0098b0] text-[#0098b0]" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Layout size={18} />
            Footer Sitemap
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Structure List */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white border border-slate-100 rounded-xl animate-pulse"></div>)}
              </div>
            ) : (
              <div className="space-y-3">
                {menus.length === 0 && (
                  <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">No menu items found. Start by adding one!</p>
                  </div>
                )}
                {menus.map((item) => (
                  <div key={item.id} className="space-y-2">
                    {/* Parent Item */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 hover:border-[#0098b0] group">
                      <div className="text-slate-300 group-hover:text-slate-400 cursor-grab active:cursor-grabbing"><GripVertical size={18} /></div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 flex items-center gap-2">
                          {item.label}
                          {item.children?.length > 0 && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase">{item.children.length} sub</span>}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><ExternalLink size={10} /> {item.url}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-[#0098b0] hover:bg-cyan-50 rounded-lg"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </div>

                    {/* Children Items */}
                    {item.children?.length > 0 && (
                      <div className="ml-12 space-y-2 relative before:absolute before:left-[-24px] before:top-[-10px] before:bottom-[20px] before:w-[2px] before:bg-slate-200">
                        {item.children.map((child: any) => (
                          <div key={child.id} className="bg-white/60 p-3 rounded-xl border border-slate-100 flex items-center gap-4 relative before:absolute before:left-[-24px] before:top-1/2 before:w-[24px] before:h-[2px] before:bg-slate-200 group">
                            <div className="text-slate-200"><GripVertical size={16} /></div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-700">{child.label}</p>
                              <p className="text-[10px] text-slate-400 italic">{child.url}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEdit(child)} className="p-1.5 text-slate-400 hover:text-[#0098b0] hover:bg-white rounded-lg shadow-sm"><Edit size={14} /></button>
                              <button onClick={() => handleDelete(child.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg shadow-sm"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Side Panel */}
          <div className="lg:col-span-1">
            <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-xl sticky top-24 transition-all ${!showForm && "opacity-50 pointer-events-none"}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  {editingItem ? <Edit size={18} /> : <Plus size={18} />}
                  {editingItem ? "Edit Menu" : "Add New Item"}
                </h3>
                {showForm && (
                  <button onClick={resetForm} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Navigation Label</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#0098b0] outline-none text-sm text-slate-900 font-medium" 
                    placeholder="e.g. Health Tips" 
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Link URL</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#0098b0] outline-none text-sm text-slate-900 font-medium" 
                    placeholder="e.g. /category/tips" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Parent Item (Optional)</label>
                  <select 
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#0098b0] outline-none text-sm text-slate-900 font-medium"
                    value={parentId || ""}
                    onChange={(e) => setParentId(e.target.value || null)}
                  >
                    <option value="">No Parent (Root)</option>
                    {menus.filter(m => m.id !== editingItem?.id).map(m => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div className="pt-4 space-y-3">
                  <button type="submit" className="w-full bg-[#0098b0] text-white py-3 rounded-xl font-bold hover:bg-[#007a8d] transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
                    <Save size={18} />
                    {editingItem ? "Update Changes" : "Add to Menu"}
                  </button>
                  {editingItem && (
                    <button type="button" onClick={resetForm} className="w-full text-slate-400 text-sm font-bold hover:text-slate-600">Cancel Editing</button>
                  )}
                </div>
              </form>
            </div>
            
            <div className="mt-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 mb-2">Editor Guide</h4>
              <ul className="text-xs text-slate-500 space-y-2">
                <li>• Use parent items to create dropdown menus.</li>
                <li>• Labels are what users see on the site.</li>
                <li>• URLs should be relative (e.g., /about) or absolute.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
