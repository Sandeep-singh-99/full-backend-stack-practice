import { useState, useRef, useEffect } from 'react';
import { Smile, Trash2 } from 'lucide-react';

interface EmojiIconProps {
  icon: string | null;
  onChange: (emoji: string | null) => void;
}

export default function EmojiIcon({ icon, onChange }: EmojiIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const emojiGroups = [
    {
      title: 'Faces & Emotion',
      emojis: ['😊', '😄', '😎', '🧐', '🥳', '🤔', '😴', '🧠', '🤖', '🦊', '🐱', '🐶'],
    },
    {
      title: 'Objects & Work',
      emojis: ['🚀', '💡', '💻', '🎨', '📝', '🎯', '📚', '📌', '🔑', '📅', '📎', '⚙️'],
    },
    {
      title: 'Nature & Symbols',
      emojis: ['🌲', '🌍', '🔥', '💧', '☀️', '🌙', '🌟', '❤️', '🍀', '✅', '⚠️', '⭐'],
    },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRandomIcon = () => {
    const allEmojis = emojiGroups.flatMap(g => g.emojis);
    const randomIndex = Math.floor(Math.random() * allEmojis.length);
    onChange(allEmojis[randomIndex]);
  };

  return (
    <div className="relative group/icon px-12 md:px-16 -mt-10 mb-4 z-20 flex select-none">
      {icon ? (
        <div className="relative flex items-end">
          {/* Main Emoji Icon Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-7xl p-1 bg-white dark:bg-zinc-900 rounded-2xl border-4 border-white dark:border-zinc-950 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer select-none leading-none flex items-center justify-center h-24 w-24"
          >
            {icon}
          </button>

          {/* Hover Controls */}
          <div className="absolute left-28 bottom-2 flex gap-1 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 p-1 rounded-lg shadow-md">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-xs px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium cursor-pointer"
            >
              Change
            </button>
            <button
              onClick={() => onChange(null)}
              className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 cursor-pointer"
              title="Remove Icon"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty Hover State: "+ Add Icon" */
        <button
          type="button"
          onClick={handleRandomIcon}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm transition-all cursor-pointer"
        >
          <Smile className="h-4 w-4" />
          Add icon
        </button>
      )}

      {/* Emoji Picker Dropdown */}
      {isOpen && (
        <div
          ref={pickerRef}
          className="absolute left-12 md:left-16 top-16 z-30 w-72 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 shadow-2xl animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-2">
            <span className="text-xs font-bold text-zinc-500">Pick an icon</span>
            <button
              type="button"
              onClick={handleRandomIcon}
              className="text-[10px] font-semibold text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              Random icon
            </button>
          </div>

          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto scrollbar-thin">
            {emojiGroups.map(group => (
              <div key={group.title}>
                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                  {group.title}
                </p>
                <div className="grid grid-cols-6 gap-1">
                  {group.emojis.map(e => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => {
                        onChange(e);
                        setIsOpen(false);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xl transition-all cursor-pointer"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {icon && (
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 w-full border-t border-zinc-100 dark:border-zinc-900 pt-2 mt-2 text-xs text-red-500 hover:text-red-600 transition-colors cursor-pointer font-medium"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove Icon
            </button>
          )}
        </div>
      )}
    </div>
  );
}
