import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';

export default function CalloutView({ node, updateAttributes }: any) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  const emojis = ['💡', 'ℹ️', '⚠️', '🔥', '🚀', '🎯', '📝', '📌', '⭐️', '🎨', '✅', '❌'];
  
  const colors = [
    { name: 'gray', bg: 'bg-zinc-50 border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100', dot: 'bg-zinc-400' },
    { name: 'blue', bg: 'bg-blue-50/70 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/40 text-blue-900 dark:text-blue-200', dot: 'bg-blue-500' },
    { name: 'green', bg: 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200', dot: 'bg-emerald-500' },
    { name: 'yellow', bg: 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 text-amber-900 dark:text-amber-200', dot: 'bg-amber-500' },
    { name: 'red', bg: 'bg-red-50/70 border-red-200 dark:bg-red-950/20 dark:border-red-900/40 text-red-900 dark:text-red-200', dot: 'bg-red-500' },
    { name: 'purple', bg: 'bg-purple-50/70 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/40 text-purple-900 dark:text-purple-200', dot: 'bg-purple-500' },
  ];

  const currentColor = colors.find(c => c.name === node.attrs.color) || colors[0];

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (colorRef.current && !colorRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <NodeViewWrapper className={`my-4 flex items-start gap-3 rounded-xl border p-4 transition-all duration-200 shadow-sm ${currentColor.bg}`}>
      {/* Emoji Picker Section */}
      <div className="relative select-none flex-shrink-0" ref={emojiRef}>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-xl transition-colors cursor-pointer"
        >
          {node.attrs.emoji}
        </button>
        {showEmojiPicker && (
          <div className="absolute left-0 top-10 z-50 grid grid-cols-4 gap-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-xl w-36">
            {emojis.map(e => (
              <button
                key={e}
                type="button"
                onClick={() => {
                  updateAttributes({ emoji: e });
                  setShowEmojiPicker(false);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-lg transition-colors cursor-pointer"
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Editable Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <NodeViewContent className="outline-none" />
      </div>

      {/* Color Picker Section */}
      <div className="relative select-none flex-shrink-0 self-start pt-1.5" ref={colorRef}>
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="flex h-5 w-5 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title="Change color theme"
        >
          <span className={`h-2.5 w-2.5 rounded-full border border-black/10 dark:border-white/10 ${currentColor.dot}`} />
        </button>
        {showColorPicker && (
          <div className="absolute right-0 top-7 z-50 flex flex-col gap-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1.5 shadow-xl min-w-28">
            {colors.map(c => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  updateAttributes({ color: c.name });
                  setShowColorPicker(false);
                }}
                className="flex items-center gap-2 w-full rounded-lg px-2 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900 text-left capitalize text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
