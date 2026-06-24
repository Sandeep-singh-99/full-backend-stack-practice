import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Edit2 } from 'lucide-react';

interface CoverImageProps {
  cover: string | null;
  onChange: (cover: string | null) => void;
}

export default function CoverImage({ cover, onChange }: CoverImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const presets = [
    {
      name: 'Sunset Gradient',
      value: 'linear-gradient(to right, #ff7e5f, #feb47b)',
      isGradient: true,
    },
    {
      name: 'Aurora Gradient',
      value: 'linear-gradient(to right, #0284c7, #10b981)',
      isGradient: true,
    },
    {
      name: 'Cyberpunk',
      value: 'linear-gradient(to right, #ec4899, #f43f5e)',
      isGradient: true,
    },
    {
      name: 'Forest Mist',
      value: 'linear-gradient(to right, #0d9488, #4ade80)',
      isGradient: true,
    },
    {
      name: 'Ocean Depths',
      value: 'linear-gradient(to right, #1e3a8a, #0284c7, #06b6d4)',
      isGradient: true,
    },
    {
      name: 'Abstract Paint',
      value: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=80',
      isGradient: false,
    },
    {
      name: 'Purple Silk',
      value: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
      isGradient: false,
    },
    {
      name: 'Mountain Range',
      value: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
      isGradient: false,
    },
    {
      name: 'Nebula Space',
      value: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&q=80',
      isGradient: false,
    },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddCover = () => {
    // Set to sunset gradient by default
    onChange(presets[0].value);
  };

  const handleCustomUrlApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl) {
      onChange(customUrl);
      setCustomUrl('');
      setIsOpen(false);
    }
  };

  const coverStyle: React.CSSProperties = cover
    ? cover.startsWith('linear-gradient')
      ? { backgroundImage: cover }
      : { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <div className="relative group/cover w-full h-[180px] md:h-[220px] bg-zinc-100 dark:bg-zinc-900 transition-all duration-200">
      {cover ? (
        <>
          {/* Main Cover Banner */}
          <div style={coverStyle} className="w-full h-full" />

          {/* Hover Control Buttons */}
          <div className="absolute right-4 bottom-4 flex gap-2 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-200 bg-black/40 dark:bg-black/60 backdrop-blur-sm p-1 rounded-lg border border-white/10 shadow-md">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 text-[10px] md:text-xs px-2.5 py-1.5 rounded-md hover:bg-white/15 text-white font-medium cursor-pointer transition-colors"
            >
              <Edit2 className="h-3 w-3" />
              Change cover
            </button>
            <button
              onClick={() => onChange(null)}
              className="flex items-center gap-1 text-[10px] md:text-xs px-2.5 py-1.5 rounded-md hover:bg-red-500/20 text-red-300 font-medium cursor-pointer transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Remove
            </button>
          </div>
        </>
      ) : (
        /* Empty Hover Button: "Add Cover" */
        <div className="w-full h-full flex items-center justify-center">
          <button
            type="button"
            onClick={handleAddCover}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer shadow-sm opacity-0 group-hover/cover:opacity-100"
          >
            <ImageIcon className="h-4 w-4" />
            Add cover
          </button>
        </div>
      )}

      {/* Cover Chooser Dropdown */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-4 bottom-14 z-30 w-80 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-2xl animate-fade-in"
        >
          <p className="text-xs font-bold text-zinc-500 mb-3 border-b border-zinc-100 dark:border-zinc-900 pb-1.5">
            Select Cover Image
          </p>

          <div className="grid grid-cols-3 gap-2 mb-4 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
            {presets.map(p => {
              const bgStyle = p.isGradient
                ? { backgroundImage: p.value }
                : { backgroundImage: `url(${p.value})`, backgroundSize: 'cover', backgroundPosition: 'center' };
              return (
                <button
                  key={p.name}
                  onClick={() => {
                    onChange(p.value);
                    setIsOpen(false);
                  }}
                  style={bgStyle}
                  className="h-12 w-full rounded-lg border border-black/10 dark:border-white/10 hover:scale-102 transition-transform cursor-pointer"
                  title={p.name}
                />
              );
            })}
          </div>

          <form onSubmit={handleCustomUrlApply} className="flex flex-col gap-1 border-t border-zinc-100 dark:border-zinc-900 pt-3">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Custom Image URL
            </label>
            <div className="flex gap-1.5 mt-1">
              <input
                type="url"
                value={customUrl}
                onChange={e => setCustomUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 outline-none placeholder-zinc-400 focus:border-blue-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-500 hover:bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer transition-colors"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
