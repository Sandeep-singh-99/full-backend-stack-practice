import { useState } from 'react';
import {
  ChevronLeft,
  Plus,
  Search,
  FileText,
  Trash2,
  Copy,
  Sun,
  Moon,
  Database,
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  cover: string | null;
  icon: string | null;
  createdAt: number;
  updatedAt: number;
}

interface SidebarProps {
  documents: Document[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onResetWorkspace: () => void;
}

export default function Sidebar({
  documents,
  activeId,
  onSelect,
  onAdd,
  onDelete,
  onDuplicate,
  darkMode,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen,
  onResetWorkspace,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter(doc =>
    (doc.title || 'Untitled').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!sidebarOpen) return null;

  return (
    <aside className="w-60 h-screen flex flex-col flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 select-none animate-slide-in">
      {/* Sidebar Header */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-850">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            N
          </div>
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Notion Workspace</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="rounded-lg p-1 hover:bg-zinc-200 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 cursor-pointer transition-colors"
          title="Collapse sidebar"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Action Area: Search & Add Page */}
      <div className="p-3 flex flex-col gap-2">
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search pages..."
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-8 pr-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 outline-none placeholder-zinc-400 transition-colors focus:border-zinc-300 dark:focus:border-zinc-700"
          />
        </div>

        {/* Add New Page Button */}
        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-zinc-200/60 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800/80 px-3 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer transition-all duration-150"
        >
          <Plus className="h-4 w-4" />
          Add a page
        </button>
      </div>

      {/* Pages list container */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin">
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-2 mb-1.5">
          Private Pages
        </p>

        {filteredDocs.length === 0 ? (
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 italic px-2">No pages found</p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {filteredDocs.map(doc => {
              const isActive = doc.id === activeId;
              return (
                <div
                  key={doc.id}
                  className={`group flex items-center justify-between rounded-lg px-2 py-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-200/50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 font-medium'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/30 dark:hover:bg-zinc-900/40'
                  }`}
                  onClick={() => onSelect(doc.id)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm flex-shrink-0 select-none">
                      {doc.icon || <FileText className="h-3.5 w-3.5 text-zinc-400" />}
                    </span>
                    <span className="text-xs truncate select-none">
                      {doc.title || 'Untitled'}
                    </span>
                  </div>

                  {/* Option buttons on hover */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity duration-150">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onDuplicate(doc.id);
                      }}
                      className="p-1 rounded hover:bg-zinc-300/50 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                      title="Duplicate page"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onDelete(doc.id);
                      }}
                      className="p-1 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-500 cursor-pointer"
                      title="Delete page"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Area: Theme Switcher & Reset */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-900 flex flex-col gap-2">
        {/* Reset Workspace button */}
        <button
          onClick={onResetWorkspace}
          className="flex items-center gap-2 w-full rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/30 dark:hover:bg-zinc-900/40 cursor-pointer transition-colors"
          title="Restore onboard onboarding document"
        >
          <Database className="h-3.5 w-3.5" />
          <span>Reset Workspace</span>
        </button>

        {/* Theme Switch Switcher */}
        <div className="flex items-center justify-between rounded-xl bg-zinc-200/40 dark:bg-zinc-900 p-1">
          <button
            onClick={() => setDarkMode(false)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
              !darkMode
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            Light
          </button>
          <button
            onClick={() => setDarkMode(true)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
              darkMode
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Moon className="h-3.5 w-3.5" />
            Dark
          </button>
        </div>
      </div>
    </aside>
  );
}
