import { useState, useRef, useEffect } from 'react';
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
  Palette,
} from 'lucide-react';

interface BubbleMenuProps {
  editor: Editor;
}

export default function BubbleMenu({ editor }: BubbleMenuProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);

  const alignRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  const highlights = [
    { name: 'Default', color: null, class: 'bg-transparent' },
    { name: 'Gray', color: '#f1f1f1', class: 'bg-zinc-200 dark:bg-zinc-800' },
    { name: 'Brown', color: '#f4eeee', class: 'bg-amber-100/70 dark:bg-amber-950/20' },
    { name: 'Orange', color: '#faebd7', class: 'bg-orange-100 dark:bg-orange-950/30' },
    { name: 'Yellow', color: '#fff9db', class: 'bg-yellow-100 dark:bg-yellow-950/30' },
    { name: 'Green', color: '#eefcf4', class: 'bg-emerald-100 dark:bg-emerald-950/30' },
    { name: 'Blue', color: '#e8f4fc', class: 'bg-blue-100 dark:bg-blue-950/30' },
    { name: 'Purple', color: '#f3e8fc', class: 'bg-purple-100 dark:bg-purple-950/30' },
    { name: 'Pink', color: '#fce8f3', class: 'bg-pink-100 dark:bg-pink-950/30' },
    { name: 'Red', color: '#fce8e8', class: 'bg-red-100 dark:bg-red-950/30' },
  ];

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (alignRef.current && !alignRef.current.contains(event.target as Node)) {
        setShowAlignMenu(false);
      }
      if (colorRef.current && !colorRef.current.contains(event.target as Node)) {
        setShowColorMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkApply = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const handleLinkCancel = () => {
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const toggleLink = () => {
    const isLinkActive = editor.isActive('link');
    if (isLinkActive) {
      editor.chain().focus().unsetLink().run();
    } else {
      const previousUrl = editor.getAttributes('link').href || '';
      setLinkUrl(previousUrl);
      setShowLinkInput(true);
    }
  };

  if (!editor) return null;

  return (
    <TiptapBubbleMenu
      editor={editor}
      className="flex items-center gap-0.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md p-1 shadow-xl z-40"
    >
      {showLinkInput ? (
        <div className="flex items-center gap-1 px-2 py-0.5">
          <input
            type="url"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleLinkApply();
              if (e.key === 'Escape') handleLinkCancel();
            }}
            placeholder="Paste or type a link..."
            className="w-48 bg-transparent text-xs text-zinc-800 dark:text-zinc-200 outline-none border-none placeholder-zinc-400 font-sans"
            autoFocus
          />
          <button
            onClick={handleLinkApply}
            className="rounded px-2 py-1 text-[10px] font-semibold bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
          >
            Apply
          </button>
          <button
            onClick={handleLinkCancel}
            className="rounded px-2 py-1 text-[10px] hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          {/* Bold */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer ${
              editor.isActive('bold') ? 'text-blue-500 bg-zinc-100 dark:bg-zinc-900' : 'text-zinc-600 dark:text-zinc-400'
            }`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>

          {/* Italic */}
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer ${
              editor.isActive('italic') ? 'text-blue-500 bg-zinc-100 dark:bg-zinc-900' : 'text-zinc-600 dark:text-zinc-400'
            }`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>

          {/* Underline */}
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer ${
              editor.isActive('underline') ? 'text-blue-500 bg-zinc-100 dark:bg-zinc-900' : 'text-zinc-600 dark:text-zinc-400'
            }`}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>

          {/* Strike */}
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer ${
              editor.isActive('strike') ? 'text-blue-500 bg-zinc-100 dark:bg-zinc-900' : 'text-zinc-600 dark:text-zinc-400'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          {/* Code */}
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer ${
              editor.isActive('code') ? 'text-blue-500 bg-zinc-100 dark:bg-zinc-900' : 'text-zinc-600 dark:text-zinc-400'
            }`}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </button>

          {/* Link */}
          <button
            onClick={toggleLink}
            className={`rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer ${
              editor.isActive('link') ? 'text-blue-500 bg-zinc-100 dark:bg-zinc-900' : 'text-zinc-600 dark:text-zinc-400'
            }`}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>

          <span className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

          {/* Alignment Dropdown */}
          <div className="relative" ref={alignRef}>
            <button
              onClick={() => {
                setShowAlignMenu(!showAlignMenu);
                setShowColorMenu(false);
              }}
              className="flex items-center gap-0.5 rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
              title="Align text"
            >
              {editor.isActive({ textAlign: 'center' }) ? (
                <AlignCenter className="h-4 w-4" />
              ) : editor.isActive({ textAlign: 'right' }) ? (
                <AlignRight className="h-4 w-4" />
              ) : editor.isActive({ textAlign: 'justify' }) ? (
                <AlignJustify className="h-4 w-4" />
              ) : (
                <AlignLeft className="h-4 w-4" />
              )}
              <ChevronDown className="h-3 w-3" />
            </button>
            {showAlignMenu && (
              <div className="absolute left-0 top-9 z-50 flex flex-col gap-0.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-lg min-w-32">
                <button
                  onClick={() => {
                    editor.chain().focus().setTextAlign('left').run();
                    setShowAlignMenu(false);
                  }}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <AlignLeft className="h-3.5 w-3.5" /> Left
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().setTextAlign('center').run();
                    setShowAlignMenu(false);
                  }}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <AlignCenter className="h-3.5 w-3.5" /> Center
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().setTextAlign('right').run();
                    setShowAlignMenu(false);
                  }}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <AlignRight className="h-3.5 w-3.5" /> Right
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().setTextAlign('justify').run();
                    setShowAlignMenu(false);
                  }}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <AlignJustify className="h-3.5 w-3.5" /> Justify
                </button>
              </div>
            )}
          </div>

          {/* Color Highlight Dropdown */}
          <div className="relative" ref={colorRef}>
            <button
              onClick={() => {
                setShowColorMenu(!showColorMenu);
                setShowAlignMenu(false);
              }}
              className="flex items-center gap-0.5 rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
              title="Highlight Background"
            >
              <Palette className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </button>
            {showColorMenu && (
              <div className="absolute right-0 top-9 z-50 flex flex-col gap-0.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-lg min-w-36 max-h-60 overflow-y-auto scrollbar-thin">
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold px-2.5 py-1">BACKGROUND HIGHLIGHT</p>
                {highlights.map(hl => (
                  <button
                    key={hl.name}
                    onClick={() => {
                      if (hl.color) {
                        editor.chain().focus().toggleHighlight({ color: hl.color }).run();
                      } else {
                        editor.chain().focus().unsetHighlight().run();
                      }
                      setShowColorMenu(false);
                    }}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                  >
                    <span className={`h-3.5 w-3.5 rounded border border-zinc-300 dark:border-zinc-700 ${hl.class}`} style={hl.color ? { backgroundColor: hl.color } : {}} />
                    {hl.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </TiptapBubbleMenu>
  );
}
