import { useState, useRef, useEffect } from 'react';
import { Menu, FileText, Download, Clock, BarChart2 } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  documentTitle: string;
  documentContent: string;
  documentObj: any;
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  documentTitle,
  documentContent,
  documentObj,
}: HeaderProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close export menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate statistics from HTML content
  const getStats = () => {
    const textContent = documentContent
      ? documentContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      : '';
    const wordCount = textContent ? textContent.split(' ').length : 0;
    const charCount = textContent ? textContent.length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    return { wordCount, charCount, readingTime };
  };

  const { wordCount, readingTime } = getStats();

  // Simple HTML to Markdown converter
  const convertToMarkdown = (html: string, title: string) => {
    let md = `# ${title}\n\n`;
    if (!html) return md;

    let processed = html;
    
    // Checklists
    processed = processed.replace(
      /<li[^>]*data-checked="true"[^>]*>.*?<input[^>]*checked[^>]*>.*?<div>(.*?)<\/div><\/li>/gi,
      '- [x] $1\n'
    );
    processed = processed.replace(
      /<li[^>]*data-checked="false"[^>]*>.*?<input[^>]*>.*?<div>(.*?)<\/div><\/li>/gi,
      '- [ ] $1\n'
    );

    // Headings
    processed = processed.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
    processed = processed.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
    processed = processed.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');

    // Paragraphs & quotes
    processed = processed.replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n\n');
    processed = processed.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
    
    // Lists
    processed = processed.replace(/<li>(.*?)<\/li>/gi, '- $1\n');
    processed = processed.replace(/<\/ul>/gi, '\n');
    processed = processed.replace(/<\/ol>/gi, '\n');
    
    // Code blocks
    processed = processed.replace(
      /<pre[^>]*><code[^>]*class="language-([^"]+)"[^>]*>(.*?)<\/code><\/pre>/gi,
      '```$1\n$2\n```\n\n'
    );
    processed = processed.replace(
      /<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi,
      '```\n$1\n```\n\n'
    );
    
    // Inline code, formatting, images
    processed = processed.replace(/<code>(.*?)<\/code>/gi, '`$1`');
    processed = processed.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
    processed = processed.replace(/<em>(.*?)<\/em>/gi, '*$1*');
    processed = processed.replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>');
    processed = processed.replace(/<img[^>]*src="([^"]+)"[^>]*>/gi, '![]($1)\n\n');
    processed = processed.replace(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Strip other elements
    processed = processed.replace(/<[^>]*>/g, '');
    
    // Unescape entities
    processed = processed
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');

    md += processed;
    return md.trim();
  };

  const triggerDownload = (filename: string, content: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = () => {
    triggerDownload(
      `${documentTitle || 'untitled'}.json`,
      JSON.stringify(documentObj, null, 2),
      'application/json'
    );
    setShowExportMenu(false);
  };

  const exportAsHTML = () => {
    const styledHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${documentTitle || 'Untitled'}</title>
  <style>
    body { font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #27272a; }
    h1 { font-size: 2.25rem; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px; }
    blockquote { border-left: 4px solid #e4e4e7; padding-left: 16px; margin: 20px 0; color: #71717a; font-style: italic; }
    pre { background: #f4f4f5; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { font-family: monospace; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    td, th { border: 1px solid #e4e4e7; padding: 8px 12px; }
    th { background: #f4f4f5; }
    ul { list-style: disc; padding-left: 20px; }
  </style>
</head>
<body>
  <h1>${documentTitle || 'Untitled'}</h1>
  ${documentContent || ''}
</body>
</html>`;
    triggerDownload(`${documentTitle || 'untitled'}.html`, styledHtml, 'text/html');
    setShowExportMenu(false);
  };

  const exportAsMarkdown = () => {
    const md = convertToMarkdown(documentContent, documentTitle || 'Untitled');
    triggerDownload(`${documentTitle || 'untitled'}.md`, md, 'text/markdown');
    setShowExportMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 select-none">
      <div className="flex items-center gap-3">
        {/* Sidebar Trigger Button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 cursor-pointer transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <FileText className="h-4 w-4 text-zinc-400" />
          <span>Workspace</span>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-zinc-800 dark:text-zinc-200 truncate max-w-[160px] md:max-w-[280px]">
            {documentTitle || 'Untitled'}
          </span>
        </div>
      </div>

      {/* Action Controls & Stats */}
      <div className="flex items-center gap-4">
        {/* Document Stats */}
        <div className="hidden md:flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
          <span className="flex items-center gap-1">
            <BarChart2 className="h-3.5 w-3.5" />
            {wordCount} words
          </span>
          <span className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readingTime} min read
          </span>
        </div>

        {/* Export Button & Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>

          {showExportMenu && (
            <div className="absolute right-0 top-9 z-30 flex flex-col gap-0.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-2xl min-w-44 animate-fade-in">
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-3 py-2">
                Download Format
              </p>
              <button
                onClick={exportAsMarkdown}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-left w-full cursor-pointer"
              >
                Markdown (.md)
              </button>
              <button
                onClick={exportAsHTML}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-left w-full cursor-pointer"
              >
                HTML Document (.html)
              </button>
              <button
                onClick={exportAsJSON}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-left w-full cursor-pointer"
              >
                JSON Payload (.json)
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
