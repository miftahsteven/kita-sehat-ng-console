"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Tags as TagIcon, 
  Users, 
  Image as ImageIcon, 
  Megaphone, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X,
  Plus,
  Info,
  MessageSquare
} from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/admin/login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { 
      name: "Articles", 
      icon: FileText, 
      path: "/admin/articles",
      submenu: [
        { name: "All Articles", path: "/admin/articles" },
        { name: "Add New", path: "/admin/articles/new" },
      ]
    },
    { name: "Categories", icon: Layers, path: "/admin/categories" },
    { name: "Menus", icon: Menu, path: "/admin/menus" },
    { name: "Authors", icon: Users, path: "/admin/authors" },
    { name: "Media", icon: ImageIcon, path: "/admin/media" },
    { name: "Banners", icon: Megaphone, path: "/admin/banners" },
    { name: "About Us", icon: Info, path: "/admin/about-us" },
    { name: "Feedbacks", icon: MessageSquare, path: "/admin/feedbacks" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push("/admin/login");
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } flex flex-col bg-[#0f172a] text-slate-300 transition-all duration-300 ease-in-out z-30`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && "hidden"}`}>
            <div className="h-8 w-8 rounded-lg bg-[#0098b0] flex items-center justify-center font-bold text-white">KS</div>
            <span className="font-bold text-white tracking-tight">KITA-SEHAT <span className="text-[#0098b0]">NG</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <div key={item.name}>
                  <a
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive 
                        ? "bg-[#0098b0] text-white" 
                        : "hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <item.icon size={20} />
                    {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                    {isSidebarOpen && item.submenu && <ChevronRight size={14} className="ml-auto opacity-50" />}
                  </a>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center gap-3 mb-4 ${!isSidebarOpen && "justify-center"}`}>
            <div className="h-10 w-10 rounded-full bg-slate-700 overflow-hidden">
              <img src={user.avatarUrl || "https://ui-avatars.com/api/?name=" + user.name} alt={user.name} />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">{user.name}</span>
                <span className="text-xs text-slate-500">{user.role}</span>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-all ${!isSidebarOpen && "justify-center"}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">
              {menuItems.find(i => pathname.startsWith(i.path))?.name || "Admin Panel"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-[#0098b0] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#007a8d] transition-all">
              <Plus size={18} />
              Add New Post
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <a href="/" target="_blank" className="text-sm font-medium text-[#103174] hover:underline">View Public Site</a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
