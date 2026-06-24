import { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import Tiptap from './components/Tiptap';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CoverImage from './components/CoverImage';
import EmojiIcon from './components/EmojiIcon';
import { Menu } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  content: string;
  cover: string | null;
  icon: string | null;
  createdAt: number;
  updatedAt: number;
}

const ONBOARDING_DOC_ID = 'welcome-page';

const createOnboardingDoc = (): Document => ({
  id: ONBOARDING_DOC_ID,
  title: 'Welcome to Notion Editor 🚀',
  cover: 'linear-gradient(to right, #ff7e5f, #feb47b)',
  icon: '🚀',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  content: `
    <p>This is a high-performance, <strong>Notion-like rich text workspace</strong> built using React, Tiptap, and Tailwind CSS. All your documents are automatically saved to your browser's local storage.</p>
    
    <div data-type="callout" emoji="💡" color="blue"><strong>Quick Start Tip:</strong> Press <code>/</code> on a new line to trigger the Slash Command menu, or select some text to style it, add links, or change color highlights!</div>
    
    <h2>🚀 Feature Highlights</h2>
    <ul data-type="taskList">
      <li data-checked="true">
        <label><input type="checkbox" checked></label>
        <div><strong>Interactive Slash Command Menu</strong>: Type <code>/</code> to insert headings, tables, dividers, code blocks, quote cards, and more.</div>
      </li>
      <li data-checked="true">
        <label><input type="checkbox" checked></label>
        <div><strong>Rich Media & Covers</strong>: Personalize your page with beautiful gradient banners and emoji icons.</div>
      </li>
      <li data-checked="false">
        <label><input type="checkbox"></label>
        <div><strong>Multi-Document Sidebar</strong>: Create, rename, duplicate, and delete pages from the sidebar panel. Try it now!</div>
      </li>
      <li data-checked="false">
        <label><input type="checkbox"></label>
        <div><strong>Premium Aesthetics</strong>: Fully featured dark mode toggle and sleek document exports.</div>
      </li>
    </ul>

    <h2>💻 Code Syntax Highlighting</h2>
    <pre><code class="language-typescript">interface EditorConfig {
  theme: 'light' | 'dark';
  enableSlashCommands: boolean;
}

const config: EditorConfig = {
  theme: 'dark',
  enableSlashCommands: true,
};
console.log("Workspace initialized!", config);</code></pre>

    <h2>📊 Clean Grid Tables</h2>
    <table>
      <thead>
        <tr>
          <th>Block Type</th>
          <th>Interactive Actions</th>
          <th>Aesthetics</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Callout Card</td>
          <td>Change emoji and theme color</td>
          <td>Pastel background, rounded border</td>
        </tr>
        <tr>
          <td>Code Block</td>
          <td>Change language and Copy Code button</td>
          <td>Catppuccin code theme container</td>
        </tr>
        <tr>
          <td>Checklist</td>
          <td>Click checkbox to strike-out row</td>
          <td>Clean checkbox custom icons</td>
        </tr>
      </tbody>
    </table>

    <blockquote>"Simplify, then add lightness." — Colin Chapman</blockquote>
    <hr />
    <p>Feel free to delete this onboarding page or modify it however you like. Happy writing!</p>
  `,
});

export default function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const editorInstanceRef = useRef<Editor | null>(null);

  // 1. Load documents and theme from localStorage
  useEffect(() => {
    const savedDocs = localStorage.getItem('notion_docs');
    const savedTheme = localStorage.getItem('notion_theme');

    if (savedDocs) {
      try {
        const parsed = JSON.parse(savedDocs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDocuments(parsed);
          setActiveId(parsed[0].id);
        } else {
          // If parsed but empty array
          const defaultDoc = createOnboardingDoc();
          setDocuments([defaultDoc]);
          setActiveId(defaultDoc.id);
        }
      } catch (e) {
        console.error('Failed to parse saved documents', e);
        const defaultDoc = createOnboardingDoc();
        setDocuments([defaultDoc]);
        setActiveId(defaultDoc.id);
      }
    } else {
      const defaultDoc = createOnboardingDoc();
      setDocuments([defaultDoc]);
      setActiveId(defaultDoc.id);
    }

    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      // Default to light
      setDarkMode(false);
    }
  }, []);

  // 2. Persist documents to localStorage on changes
  const saveDocuments = (updatedDocs: Document[]) => {
    setDocuments(updatedDocs);
    localStorage.setItem('notion_docs', JSON.stringify(updatedDocs));
  };

  // 3. Sync Dark Mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('notion_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('notion_theme', 'light');
    }
  }, [darkMode]);

  const activeDoc = documents.find(d => d.id === activeId) || null;

  // Document Mutators
  const handleUpdateContent = (content: string) => {
    if (!activeId) return;
    const updated = documents.map(doc =>
      doc.id === activeId ? { ...doc, content, updatedAt: Date.now() } : doc
    );
    saveDocuments(updated);
  };

  const handleUpdateTitle = (title: string) => {
    if (!activeId) return;
    const updated = documents.map(doc =>
      doc.id === activeId ? { ...doc, title, updatedAt: Date.now() } : doc
    );
    saveDocuments(updated);
  };

  const handleUpdateCover = (cover: string | null) => {
    if (!activeId) return;
    const updated = documents.map(doc =>
      doc.id === activeId ? { ...doc, cover, updatedAt: Date.now() } : doc
    );
    saveDocuments(updated);
  };

  const handleUpdateIcon = (icon: string | null) => {
    if (!activeId) return;
    const updated = documents.map(doc =>
      doc.id === activeId ? { ...doc, icon, updatedAt: Date.now() } : doc
    );
    saveDocuments(updated);
  };

  const handleAddPage = () => {
    const newDoc: Document = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: '',
      content: '<p></p>',
      cover: null,
      icon: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveDocuments([...documents, newDoc]);
    setActiveId(newDoc.id);

    // Focus editor and set title input focus
    setTimeout(() => {
      const titleInput = document.getElementById('document-title-input');
      if (titleInput) titleInput.focus();
    }, 100);
  };

  const handleDeletePage = (idToDelete: string) => {
    const remaining = documents.filter(d => d.id !== idToDelete);
    if (remaining.length === 0) {
      // If we deleted the last page, create a new blank page
      const defaultDoc = createOnboardingDoc();
      saveDocuments([defaultDoc]);
      setActiveId(defaultDoc.id);
      return;
    }

    saveDocuments(remaining);

    // If active page was deleted, activate another page
    if (activeId === idToDelete) {
      setActiveId(remaining[0].id);
    }
  };

  const handleDuplicatePage = (idToDuplicate: string) => {
    const docToClone = documents.find(d => d.id === idToDuplicate);
    if (!docToClone) return;

    const duplicate: Document = {
      ...docToClone,
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: docToClone.title ? `Copy of ${docToClone.title}` : 'Copy of Untitled',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    saveDocuments([...documents, duplicate]);
    setActiveId(duplicate.id);
  };

  const handleResetWorkspace = () => {
    if (window.confirm('Are you sure you want to restore the default onboarding workspace? This will overwrite existing pages.')) {
      const defaultDoc = createOnboardingDoc();
      saveDocuments([defaultDoc]);
      setActiveId(defaultDoc.id);
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Sidebar Navigation */}
      <Sidebar
        documents={documents}
        activeId={activeId}
        onSelect={setActiveId}
        onAdd={handleAddPage}
        onDelete={handleDeletePage}
        onDuplicate={handleDuplicatePage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onResetWorkspace={handleResetWorkspace}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {activeDoc ? (
          <>
            {/* Topbar navigation and stats */}
            <Header
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              documentTitle={activeDoc.title}
              documentContent={activeDoc.content}
              documentObj={activeDoc}
            />

            {/* Editor Workspace Canvas */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {/* Cover Banner */}
              <CoverImage cover={activeDoc.cover} onChange={handleUpdateCover} />

              <div className="max-w-4xl mx-auto">
                {/* Emoji Page Icon Overlay */}
                <EmojiIcon icon={activeDoc.icon} onChange={handleUpdateIcon} />

                {/* Main Content Area */}
                <div className="px-12 md:px-16 pt-2">
                  {/* Document Title Input */}
                  <input
                    id="document-title-input"
                    type="text"
                    value={activeDoc.title}
                    onChange={e => handleUpdateTitle(e.target.value)}
                    placeholder="Untitled"
                    className="w-full text-4xl font-extrabold bg-transparent outline-none border-none placeholder-zinc-200 dark:placeholder-zinc-800 text-zinc-900 dark:text-zinc-100 mb-6 font-sans focus:ring-0"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (editorInstanceRef.current) {
                          editorInstanceRef.current.commands.focus('start');
                        }
                      }
                    }}
                  />

                  {/* Rich Text Editor */}
                  <Tiptap
                    content={activeDoc.content}
                    onChange={handleUpdateContent}
                    editorRef={editorInstanceRef}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty/Fallback State */
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">No document selected</p>
            <button
              onClick={handleAddPage}
              className="rounded-lg bg-blue-500 hover:bg-blue-600 px-4 py-2 text-xs font-semibold text-white cursor-pointer shadow transition-colors"
            >
              Create a page
            </button>
          </div>
        )}

        {/* Sidebar Toggle Floating Button when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute left-4 top-16 z-20 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm p-2 text-zinc-500 dark:text-zinc-400 shadow-md hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
            title="Expand sidebar"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        )}
      </main>
    </div>
  );
}