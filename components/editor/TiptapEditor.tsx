"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Undo, 
  Redo, 
  ImageIcon, 
  LinkIcon 
} from "lucide-react";

import { useState } from "react";
import MediaSelector from "@/components/media/MediaSelector";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor, onOpenMedia }: { editor: any, onOpenMedia: () => void }) => {
  if (!editor) return null;

  const btnClass = (active: boolean) => 
    `p-2 rounded-lg transition-all ${active ? "bg-[#0098b0] text-white" : "hover:bg-slate-100 text-slate-600"}`;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 p-2 bg-slate-50 sticky top-0 z-10">
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()} 
        className={btnClass(editor.isActive("bold"))}
      >
        <Bold size={18} />
      </button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()} 
        className={btnClass(editor.isActive("italic"))}
      >
        <Italic size={18} />
      </button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()} 
        className={btnClass(editor.isActive("underline"))}
      >
        <UnderlineIcon size={18} />
      </button>
      <div className="w-px h-6 bg-slate-200 mx-1"></div>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
        className={btnClass(editor.isActive("heading", { level: 2 }))}
      >
        <Heading1 size={18} />
      </button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
        className={btnClass(editor.isActive("heading", { level: 3 }))}
      >
        <Heading2 size={18} />
      </button>
      <div className="w-px h-6 bg-slate-200 mx-1"></div>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()} 
        className={btnClass(editor.isActive("bulletList"))}
      >
        <List size={18} />
      </button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()} 
        className={btnClass(editor.isActive("orderedList"))}
      >
        <ListOrdered size={18} />
      </button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()} 
        className={btnClass(editor.isActive("blockquote"))}
      >
        <Quote size={18} />
      </button>
      <div className="w-px h-6 bg-slate-200 mx-1"></div>
      <button type="button" onClick={onOpenMedia} className={btnClass(false)}><ImageIcon size={18} /></button>
      <button type="button" className={btnClass(false)}><LinkIcon size={18} /></button>
      <div className="ml-auto flex gap-1">
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)}><Undo size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)}><Redo size={18} /></button>
      </div>
    </div>
  );
};

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [isMediaOpen, setIsMediaOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link,
      Placeholder.configure({
        placeholder: "Tulis isi artikel kesehatan Anda di sini...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none focus:outline-none p-6 min-h-[400px]",
      },
    },
  });

  const addImage = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-inner">
      <MenuBar editor={editor} onOpenMedia={() => setIsMediaOpen(true)} />
      <EditorContent editor={editor} />
      <MediaSelector 
        isOpen={isMediaOpen} 
        onClose={() => setIsMediaOpen(false)} 
        onSelect={addImage} 
      />
    </div>
  );
}
