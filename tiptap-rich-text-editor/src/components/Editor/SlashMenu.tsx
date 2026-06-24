import React, { useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import type { SlashMenuItem } from './menuItems';

interface SlashMenuProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
  anchorRect: DOMRect | null;
  selectedIndex: number;
  filteredItems: SlashMenuItem[];
  onItemSelect: (item: SlashMenuItem) => void;
}

export default function SlashMenu({
  isOpen,
  anchorRect,
  selectedIndex,
  filteredItems,
  onItemSelect,
}: SlashMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

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
            onClick={() => onItemSelect(item)}
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
