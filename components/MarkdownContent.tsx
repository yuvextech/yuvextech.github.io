import React, { useState } from 'react';
import { marked, Tokens } from 'marked';

interface CodeSnippetData {
  title: string;
  language: string;
  code: string;
}

interface MarkdownContentProps {
  content: string;
  codeSnippet?: CodeSnippetData;
  className?: string;
}

// Single Interactive Code Block Component
export const InteractiveCodeBlock: React.FC<{
  code: string;
  language?: string;
  title?: string;
}> = ({ code, language, title }) => {
  const [copied, setCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  const cleanLang = (language || 'plaintext').trim().toLowerCase();
  const displayLang = cleanLang.toUpperCase();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy code to clipboard', e);
    }
  };

  const lines = code.split('\n');

  return (
    <div className="my-8 rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl overflow-hidden group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900/90 border-b border-gray-800 text-xs text-gray-400 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              {displayLang}
            </span>
            {title && (
              <span className="text-gray-300 font-mono text-xs font-semibold truncate max-w-xs sm:max-w-md">
                {title}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
              showLineNumbers
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                : 'text-gray-500 hover:text-gray-300'
            }`}
            title="Toggle line numbers"
          >
            # Lines
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white font-mono text-xs transition-all flex items-center gap-1.5 border border-white/5 hover:border-white/10 active:scale-95 cursor-pointer"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <span className="text-emerald-400 font-bold">✓</span>
                <span className="text-emerald-300 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Lines Body */}
      <div className="p-4 sm:p-5 overflow-x-auto bg-black/60 font-mono text-xs sm:text-sm text-gray-200 leading-relaxed">
        {showLineNumbers ? (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02]">
                  <td className="pr-4 py-0.5 text-right select-none text-gray-600 dark:text-gray-600 font-mono text-xs w-8 whitespace-nowrap">
                    {idx + 1}
                  </td>
                  <td className="py-0.5 whitespace-pre font-mono text-gray-200 font-normal">
                    {line || ' '}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre className="font-mono text-gray-200 whitespace-pre">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
};

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, codeSnippet, className = '' }) => {
  // Parse markdown into tokens
  const tokens = React.useMemo(() => {
    if (!content) return [];
    try {
      return marked.lexer(content);
    } catch (e) {
      console.error('Failed to parse markdown', e);
      return [];
    }
  }, [content]);

  return (
    <div className={`markdown-body space-y-6 ${className}`}>
      {tokens.map((token, index) => {
        // Code Block
        if (token.type === 'code') {
          const codeToken = token as Tokens.Code;
          return (
            <InteractiveCodeBlock
              key={`code-${index}`}
              code={codeToken.text}
              language={codeToken.lang}
            />
          );
        }

        // Heading
        if (token.type === 'heading') {
          const headingToken = token as Tokens.Heading;
          const headingHtml = marked.parser([token]);
          return (
            <div
              key={`heading-${index}`}
              className="mt-10 mb-4 [&_h1]:text-3xl [&_h1]:sm:text-4xl [&_h1]:font-black [&_h1]:text-gray-900 [&_h1]:dark:text-white [&_h1]:tracking-tight [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-black [&_h2]:text-gray-900 [&_h2]:dark:text-white [&_h2]:tracking-tight [&_h2]:border-b [&_h2]:border-gray-200 [&_h2]:dark:border-gray-800 [&_h2]:pb-2.5 [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:dark:text-white [&_h3]:tracking-tight"
              dangerouslySetInnerHTML={{ __html: headingHtml }}
            />
          );
        }

        // Blockquote
        if (token.type === 'blockquote') {
          const quoteHtml = marked.parser([token]);
          return (
            <div
              key={`quote-${index}`}
              className="my-6 pl-5 border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 py-4 pr-5 rounded-r-2xl text-gray-800 dark:text-gray-200 italic font-medium [&_p]:mb-0 [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: quoteHtml }}
            />
          );
        }

        // List
        if (token.type === 'list') {
          const listHtml = marked.parser([token]);
          return (
            <div
              key={`list-${index}`}
              className="my-5 text-gray-700 dark:text-gray-300 font-medium leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:bg-blue-50 [&_code]:dark:bg-blue-950/50 [&_code]:text-blue-600 [&_code]:dark:text-blue-300 [&_code]:font-mono [&_code]:text-sm"
              dangerouslySetInnerHTML={{ __html: listHtml }}
            />
          );
        }

        // Table
        if (token.type === 'table') {
          const tableHtml = marked.parser([token]);
          return (
            <div
              key={`table-${index}`}
              className="my-8 overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm [&_table]:w-full [&_table]:text-left [&_table]:text-xs [&_table]:sm:text-sm [&_th]:p-3 [&_th]:bg-gray-100 [&_th]:dark:bg-gray-900 [&_th]:font-bold [&_th]:text-gray-900 [&_th]:dark:text-white [&_td]:p-3 [&_td]:border-t [&_td]:border-gray-200 [&_td]:dark:border-gray-800 [&_td]:text-gray-700 [&_td]:dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: tableHtml }}
            />
          );
        }

        // Standard Paragraph or HTML block
        try {
          const html = marked.parser([token]);
          return (
            <div
              key={`block-${index}`}
              className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed [&_p]:mb-4 [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:underline [&_a]:font-semibold hover:[&_a]:text-blue-500 [&_strong]:text-gray-900 [&_strong]:dark:text-white [&_strong]:font-bold [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:bg-blue-50 [&_code]:dark:bg-blue-950/50 [&_code]:text-blue-600 [&_code]:dark:text-blue-300 [&_code]:font-mono [&_code]:text-sm [&_code]:border [&_code]:border-blue-200 [&_code]:dark:border-blue-900/40"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return null;
        }
      })}

      {/* Attached Architectural Code Section (if present) */}
      {codeSnippet && (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Attached Code Implementation Section
            </span>
          </div>
          <InteractiveCodeBlock
            code={codeSnippet.code}
            language={codeSnippet.language}
            title={codeSnippet.title}
          />
        </div>
      )}
    </div>
  );
};

export default MarkdownContent;
