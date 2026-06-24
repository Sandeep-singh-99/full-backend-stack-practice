import { useEffect, useState, useRef, useMemo } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { createLowlight, common } from 'lowlight';

// Custom Nodes and Components
import { Callout } from '../extensions/Callout';
import CodeBlockComponent from './Editor/CodeBlockComponent';
import SlashMenu from './Editor/SlashMenu';
import BubbleMenu from './Editor/BubbleMenu';
import TableBubbleMenu from './Editor/TableBubbleMenu';
import { getMenuItems } from './Editor/menuItems';
import type { SlashMenuItem } from './Editor/menuItems';

const lowlight = createLowlight(common);

interface TiptapProps {
  content: string;
  onChange: (html: string) => void;
  editorRef?: React.MutableRefObject<Editor | null>;
}

export default function Tiptap({ content, onChange, editorRef }: TiptapProps) {
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [slashAnchorRect, setSlashAnchorRect] = useState<DOMRect | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuItems = useMemo(() => getMenuItems(), []);

  // Filter menu items based on query
  const filteredItems = useMemo(() => {
    const cleanQuery = slashQuery.toLowerCase().replace('/', '').trim();
    if (!cleanQuery) return menuItems;

    return menuItems.filter(
      item =>
        item.title.toLowerCase().includes(cleanQuery) ||
        item.description.toLowerCase().includes(cleanQuery) ||
        item.keywords.some(kw => kw.includes(cleanQuery))
    );
  }, [slashQuery, menuItems]);

  // Use refs to avoid stale closures in ProseMirror keydown handlers
  const slashMenuOpenRef = useRef(slashMenuOpen);
  const selectedIndexRef = useRef(selectedIndex);
  const filteredItemsRef = useRef(filteredItems);

  useEffect(() => {
    slashMenuOpenRef.current = slashMenuOpen;
  }, [slashMenuOpen]);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    filteredItemsRef.current = filteredItems;
  }, [filteredItems]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [slashQuery]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default code block to use lowlight version
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline hover:text-blue-600 transition-colors',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-6 border border-zinc-200 dark:border-zinc-800 shadow-sm mx-auto block',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start gap-2',
        },
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({
        lowlight,
      }),
      Callout,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`;
          }
          if (node.type.name === 'callout') {
            return 'Callout content...';
          }
          return "Press '/' for commands...";
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-[500px] pb-32 pr-2 text-zinc-800 dark:text-zinc-200',
      },
      handleKeyDown(_view, event) {
        if (slashMenuOpenRef.current) {
          const items = filteredItemsRef.current;
          const index = selectedIndexRef.current;

          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedIndex(prev => (prev + 1) % items.length);
            return true;
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedIndex(prev => (prev - 1 + items.length) % items.length);
            return true;
          }
          if (event.key === 'Enter') {
            event.preventDefault();
            const selectedItem = items[index];
            if (selectedItem && editor) {
              // Delete slash text using Tiptap chain
              const { state } = editor;
              const { selection } = state;
              const { $from } = selection;
              const currentLineText = $from.parent.textContent;
              const slashIndex = currentLineText.lastIndexOf('/');
              if (slashIndex !== -1) {
                const fromPos = $from.pos - (currentLineText.length - slashIndex);
                const toPos = $from.pos;
                editor.chain().focus().deleteRange({ from: fromPos, to: toPos }).run();
              }
              // Run command
              selectedItem.command(editor);
            }
            setSlashMenuOpen(false);
            return true;
          }
          if (event.key === 'Escape') {
            event.preventDefault();
            setSlashMenuOpen(false);
            return true;
          }
        }
        return false;
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Share editor instance with parent via ref
  useEffect(() => {
    if (editorRef && editor) {
      editorRef.current = editor;
    }
  }, [editor, editorRef]);

  // Synchronize external content changes (like loading another document)
  const prevContentRef = useRef(content);
  useEffect(() => {
    if (editor && content !== prevContentRef.current) {
      // Set content only if it is actually different, preventing cursor jumps during typing
      const html = editor.getHTML();
      if (html !== content) {
        editor.commands.setContent(content);
      }
      prevContentRef.current = content;
    }
  }, [content, editor]);

  // Analyze text for slash command trigger
  const checkSlashCommand = () => {
    if (!editor) return;
    const { selection } = editor.state;
    const { $from } = selection;

    if (!selection.empty) {
      setSlashMenuOpen(false);
      return;
    }

    const currentLineText = $from.parent.textContent;
    const textBeforeCursor = currentLineText.slice(0, $from.parentOffset);
    const match = textBeforeCursor.match(/(?:^|\s)\/([a-zA-Z0-9]*)$/);

    if (match) {
      setSlashMenuOpen(true);
      setSlashQuery(match[1]);

      try {
        const coords = editor.view.coordsAtPos($from.pos);
        const rect = {
          top: coords.top,
          bottom: coords.bottom,
          left: coords.left,
          right: coords.right,
          width: 0,
          height: coords.bottom - coords.top,
          x: coords.left,
          y: coords.top,
          toJSON: () => {},
        } as DOMRect;
        setSlashAnchorRect(rect);
      } catch (e) {
        console.warn('Failed to calculate cursor position', e);
      }
    } else {
      setSlashMenuOpen(false);
    }
  };

  useEffect(() => {
    if (!editor) return;
    editor.on('selectionUpdate', checkSlashCommand);
    editor.on('update', checkSlashCommand);
    return () => {
      editor.off('selectionUpdate', checkSlashCommand);
      editor.off('update', checkSlashCommand);
    };
  }, [editor]);

  // Handle clicking items in the Slash Menu
  const handleItemSelect = (item: SlashMenuItem) => {
    if (!editor) return;
    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;
    const currentLineText = $from.parent.textContent;
    const slashIndex = currentLineText.lastIndexOf('/');
    if (slashIndex !== -1) {
      const fromPos = $from.pos - (currentLineText.length - slashIndex);
      const toPos = $from.pos;
      editor.chain().focus().deleteRange({ from: fromPos, to: toPos }).run();
    }
    item.command(editor);
    setSlashMenuOpen(false);
  };

  if (!editor) return null;

  return (
    <div className="relative w-full">
      {/* Inline Formatting Menu */}
      <BubbleMenu editor={editor} />

      {/* Table Context Overlay Menu */}
      <TableBubbleMenu editor={editor} />

      {/* Slash Command Dropdown Menu */}
      <SlashMenu
        editor={editor}
        isOpen={slashMenuOpen}
        onClose={() => setSlashMenuOpen(false)}
        anchorRect={slashAnchorRect}
        selectedIndex={selectedIndex}
        filteredItems={filteredItems}
        onItemSelect={handleItemSelect}
      />

      {/* The main editor viewport */}
      <EditorContent editor={editor} />
    </div>
  );
}