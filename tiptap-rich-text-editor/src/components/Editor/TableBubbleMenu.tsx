import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus';
import { Editor } from '@tiptap/react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Table as TableIcon,
  Combine,
} from 'lucide-react';

interface TableBubbleMenuProps {
  editor: Editor;
}

export default function TableBubbleMenu({ editor }: TableBubbleMenuProps) {
  if (!editor) return null;

  // Custom check to only show the table bubble menu if the editor selection is inside a table
  const shouldShow = ({ editor }: { editor: Editor }) => {
    return editor.isActive('table');
  };

  return (
    <TiptapBubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      className="flex items-center gap-0.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md p-1 shadow-xl z-40"
    >
      {/* Row Operations */}
      <button
        onClick={() => editor.chain().focus().addRowBefore().run()}
        className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-blue-500 transition-colors cursor-pointer"
        title="Insert row above"
      >
        <div className="relative">
          <TableIcon className="h-4 w-4 opacity-40" />
          <ArrowUp className="h-2.5 w-2.5 absolute top-0.5 left-0.5" />
        </div>
      </button>

      <button
        onClick={() => editor.chain().focus().addRowAfter().run()}
        className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-blue-500 transition-colors cursor-pointer"
        title="Insert row below"
      >
        <div className="relative">
          <TableIcon className="h-4 w-4 opacity-40" />
          <ArrowDown className="h-2.5 w-2.5 absolute bottom-0.5 left-0.5" />
        </div>
      </button>

      <button
        onClick={() => editor.chain().focus().deleteRow().run()}
        className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
        title="Delete row"
      >
        <div className="relative">
          <TableIcon className="h-4 w-4 opacity-40 text-red-500" />
          <Trash2 className="h-2.5 w-2.5 absolute top-0.5 left-0.5 text-red-500" />
        </div>
      </button>

      <span className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

      {/* Column Operations */}
      <button
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-blue-500 transition-colors cursor-pointer"
        title="Insert column left"
      >
        <div className="relative">
          <TableIcon className="h-4 w-4 opacity-40" />
          <ArrowLeft className="h-2.5 w-2.5 absolute top-0.5 left-0.5" />
        </div>
      </button>

      <button
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-blue-500 transition-colors cursor-pointer"
        title="Insert column right"
      >
        <div className="relative">
          <TableIcon className="h-4 w-4 opacity-40" />
          <ArrowRight className="h-2.5 w-2.5 absolute top-0.5 right-0.5" />
        </div>
      </button>

      <button
        onClick={() => editor.chain().focus().deleteColumn().run()}
        className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
        title="Delete column"
      >
        <div className="relative">
          <TableIcon className="h-4 w-4 opacity-40 text-red-500" />
          <Trash2 className="h-2.5 w-2.5 absolute top-0.5 left-0.5 text-red-500" />
        </div>
      </button>

      <span className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

      {/* Merge Cells */}
      <button
        onClick={() => editor.chain().focus().mergeCells().run()}
        className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-blue-500 transition-colors cursor-pointer"
        title="Merge cells"
      >
        <Combine className="h-4 w-4" />
      </button>

      {/* Delete Table */}
      <button
        onClick={() => editor.chain().focus().deleteTable().run()}
        className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
        title="Delete entire table"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </TiptapBubbleMenu>
  );
}
