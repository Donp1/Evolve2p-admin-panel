"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value?: string;
  onChange?: (val: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[150px] p-3 outline-none rounded-md bg-slate-800/50 border border-slate-700 text-slate-200",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border border-slate-700 bg-slate-900/60 rounded-md p-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(editor.isActive("bold") && "bg-slate-700 text-white")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(editor.isActive("italic") && "bg-slate-700 text-white")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(editor.isActive("strike") && "bg-slate-700 text-white")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          Strike
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            editor.isActive("bulletList") && "bg-slate-700 text-white"
          )}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            editor.isActive("orderedList") && "bg-slate-700 text-white"
          )}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </Button>
      </div>

      {/* Editable area */}
      <EditorContent editor={editor} />
    </div>
  );
}
