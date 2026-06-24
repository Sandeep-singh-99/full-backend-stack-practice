import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CodeBlockComponent({
  node,
  updateAttributes,
  extension,
}: any) {
  const language = node?.attrs?.language;
  const textContent = node?.textContent || '';
  const [copied, setCopied] = useState(false);

  // Fallback languages list if lowlight is not fully initialized
  const defaultLanguages = [
    'javascript',
    'typescript',
    'python',
    'css',
    'html',
    'json',
    'yaml',
    'markdown',
    'bash',
    'rust',
    'go',
    'cpp',
    'java',
    'sql',
  ];

  const languages =
    extension?.options?.lowlight?.listLanguages() || defaultLanguages;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <NodeViewWrapper className="code-block relative group my-6">
      {/* Top Header Bar for Code Block */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-800/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-zinc-700">
        {/* Language Selector */}
        <select
          value={language || 'auto'}
          onChange={e => updateAttributes({ language: e.target.value })}
          className="bg-transparent text-xs text-zinc-300 outline-none cursor-pointer pr-1 border-none font-sans capitalize"
        >
          <option value="auto" className="bg-zinc-800 text-zinc-300">Auto</option>
          {languages.map((lang: string) => (
            <option key={lang} value={lang} className="bg-zinc-800 text-zinc-300">
              {lang}
            </option>
          ))}
        </select>

        <span className="w-px h-3 bg-zinc-700" />

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Copy Code"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400 animate-scale-up" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Editor Node View Content */}
      <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
        <NodeViewContent as={"code" as any} />
      </pre>
    </NodeViewWrapper>
  );
}
