import React, { useEffect, useMemo, useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Terminal,
  Table as TableIcon,
  Image as ImageIcon,
  Minus,
  HelpCircle,
  Type,
} from 'lucide-react';

interface SlashMenuProps {
  editor: Editor;
  query: string;
  isOpen: boolean;
  onClose: () => void;
  anchorRect: DOMRect | null;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  setMenuFilteredCount: (count: number) => void;
}

export interface SlashMenuItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  keywords: string[];
  command: (editor: Editor) => void;
}

export default function SlashMenu({
  editor,
  query,
  isOpen,
  onClose,
  anchorRect,
  selectedIndex,
  setSelectedIndex,
  setMenuFilteredCount,
}: SlashMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems: SlashMenuItem[] = useMemo(
    () => [
      {
        title: 'Text',
        description: 'Just start writing with plain text.',
        icon: <Type className="h-4 w-4" />,
        keywords: ['text', 'paragraph', 'p'],
        command: ed => ed.chain().focus().setParagraph().run(),
      },
      {
        title: 'Heading 1',
        description: 'Big section heading.',
        icon: <Heading1 className="h-4 w-4" />,
        keywords: ['h1', 'heading', 'large', 'title'],
        command: ed => ed.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        title: 'Heading 2',
        description: 'Medium section heading.',
        icon: <Heading2 className="h-4 w-4" />,
        keywords: ['h2', 'heading', 'medium'],
        command: ed => ed.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        title: 'Heading 3',
        description: 'Small section heading.',
        icon: <Heading3 className="h-4 w-4" />,
        keywords: ['h3', 'heading', 'small'],
        command: ed => ed.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      {
        title: 'Todo List',
        description: 'Track tasks with a checklist.',
        icon: <CheckSquare className="h-4 w-4" />,
        keywords: ['todo', 'checklist', 'task', 'list'],
        command: ed => ed.chain().focus().toggleTaskList().run(),
      },
      {
        title: 'Bulleted List',
        description: 'Create a simple bulleted list.',
        icon: <List className="h-4 w-4" />,
        keywords: ['bullet', 'list', 'ul'],
        command: ed => ed.chain().focus().toggleBulletList().run(),
      },
      {
        title: 'Numbered List',
        description: 'Create a list with numbering.',
        icon: <ListOrdered className="h-4 w-4" />,
        keywords: ['numbered', 'list', 'ol'],
        command: ed => ed.chain().focus().toggleOrderedList().run(),
      },
      {
        title: 'Quote',
        description: 'Capture a quote.',
        icon: <Quote className="h-4 w-4" />,
        keywords: ['quote', 'blockquote', 'cite'],
        command: ed => ed.chain().focus().toggleBlockquote().run(),
      },
      {
        title: 'Callout',
        description: 'Make writing stand out with an emoji and border box.',
        icon: <HelpCircle className="h-4 w-4" />,
        keywords: ['callout', 'box', 'card', 'highlight', 'info'],
        command: ed => ed.chain().focus().setCallout().run(),
      },
      {
        title: 'Code Block',
        description: 'Write code with syntax highlighting.',
        icon: <Terminal className="h-4 w-4" />,
        keywords: ['code', 'block', 'highlight', 'pre'],
        command: ed => ed.chain().focus().toggleCodeBlock().run(),
      },
      {
        title: 'Table',
        description: 'Insert a grid table.',
        icon: <TableIcon className="h-4 w-4" />,
        keywords: ['table', 'grid', 'matrix'],
        command: ed =>
          ed.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      },
      {
        title: 'Image',
        description: 'Insert an image via link.',
        icon: <ImageIcon className="h-4 w-4" />,
        keywords: ['image', 'photo', 'picture', 'url'],
        command: ed => {
          const url = window.prompt('Enter image URL:');
          if (url) {
            ed.chain().focus().setImage({ src: url }).run();
          }
        },
      },
      {
        title: 'Divider',
        description: 'Visually divide blocks with a line.',
        icon: <Minus className="h-4 w-4" />,
        keywords: ['divider', 'hr', 'line', 'separator'],
        command: ed => ed.chain().focus().setHorizontalRule().run(),
      },
    ],
    []
  );

  // Filter items based on the slash command search query
  const filteredItems = useMemo(() => {
    const cleanQuery = query.toLowerCase().replace('/', '').trim();
    if (!cleanQuery) return menuItems;

    return menuItems.filter(
      item =>
        item.title.toLowerCase().includes(cleanQuery) ||
        item.description.toLowerCase().includes(cleanQuery) ||
        item.keywords.some(kw => kw.includes(cleanQuery))
    );
  }, [query, menuItems]);

  // Keep filtered count in sync with parent component
  useEffect(() => {
    setMenuFilteredCount(filteredItems.length);
  }, [filteredItems.length, setMenuFilteredCount]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, setSelectedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (menuRef.current && selectedIndex >= 0) {
      const activeEl = menuRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Auto-close if no matches
  if (!isOpen || filteredItems.length === 0 || !anchorRect) return null;

  // Calculate coordinates to position floating menu
  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    top: `${anchorRect.bottom + window.scrollY + 6}px`,
    left: `${Math.min(anchorRect.left + window.scrollX, window.innerWidth - 320)}px`,
    maxHeight: '320px',
    width: '280px',
  };

  const handleItemClick = (item: SlashMenuItem) => {
    // Delete slash text
    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;
    const currentLineText = $from.parent.textContent;
    
    // Find index of last typed '/'
    const slashIndex = currentLineText.lastIndexOf('/');
    if (slashIndex !== -1) {
      const fromPos = $from.pos - (currentLineText.length - slashIndex);
      const toPos = $from.pos;
      editor.chain().focus().deleteRange({ from: fromPos, to: toPos }).run();
    }

    // Trigger command
    item.command(editor);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      style={menuStyle}
      className="z-50 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md p-1.5 shadow-2xl animate-fade-in scrollbar-thin"
    >
      {filteredItems.map((item, index) => {
        const isActive = index === selectedIndex;
        return (
          <button
            key={item.title}
            type="button"
            onClick={() => handleItemClick(item)}
            className={`flex items-start gap-3 w-full rounded-lg px-2.5 py-2 text-left transition-all cursor-pointer ${
              isActive
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
            }`}
          >
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border transition-colors ${
                isActive
                  ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900'
              }`}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold">{item.title}</p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                {item.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
