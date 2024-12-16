import React, { useEffect, useRef, useState } from "react";
import Prism from "prismjs";

// Modern theme imports
import "prismjs/themes/prism-tomorrow.css"; // A more vibrant theme
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/toolbar/prism-toolbar.css";
import "prismjs/plugins/toolbar/prism-toolbar";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";

// Dynamic language imports
const languageImports: Record<string, () => Promise<void>> = {
  javascript: () => import("prismjs/components/prism-javascript" as string),
  typescript: () => import("prismjs/components/prism-typescript" as string),
  jsx: () => import("prismjs/components/prism-jsx" as string),
  tsx: () =>import("prismjs/components/prism-tsx" as string),
  python: () => import("prismjs/components/prism-python" as string),
  json: () => import("prismjs/components/prism-json" as string),
  css: () => import("prismjs/components/prism-css" as string),
  java: () => import("prismjs/components/prism-java" as string),
  dart: () => import("prismjs/components/prism-dart" as string),
  csharp: () => import("prismjs/components/prism-csharp" as string),
  c: () => import("prismjs/components/prism-c" as string),
  cpp: () => import("prismjs/components/prism-cpp" as string),
  go: () => import("prismjs/components/prism-go" as string),
  ruby: () => import("prismjs/components/prism-ruby" as string),
  php: () => import("prismjs/components/prism-php" as string),
  bash: () => import("prismjs/components/prism-bash" as string),
  markdown: () => import("prismjs/components/prism-markdown" as string),
  yaml: () => import("prismjs/components/prism-yaml" as string),
  html: () => import("prismjs/components/prism-markup" as string),
};

// File extension to language map
const extensionToLanguage: Record<string, string> = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  py: "python",
  json: "json",
  css: "css",
  html: "html",
  java: "java",
  cs: "csharp",
  c: "c",
  cpp: "cpp",
  go: "go",
  rb: "ruby",
  php: "php",
  sh: "bash",
  md: "markdown",
  yaml: "yaml",
  yml: "yaml",
  txt: "plaintext",
  dart: "dart"
};

interface SyntaxHighlighterProps {
  code: string | null;
  fileExtension: string | null;
  className?: string;
  showLineNumbers?: boolean;
  title?: string;
}

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({
  code,
  fileExtension,
  className = '',
  showLineNumbers = true,
  title
}) => {
  const codeRef = useRef<HTMLPreElement>(null);
  const [languageLoaded, setLanguageLoaded] = useState(false);

  useEffect(() => {
    // If no code or ref is available, do nothing
    if (!code || !codeRef.current) return;

    // Determine the language
    const language = fileExtension 
      ? extensionToLanguage[fileExtension.toLowerCase()] || 'plaintext'
      : 'plaintext';

    // Function to safely highlight code
    const highlightCode = () => {
      try {
        if (Prism.languages[language]) {
          Prism.highlightElement(codeRef.current!.querySelector('code')!);
        } else {
          console.warn(`Language ${language} not loaded`);
        }
      } catch (error) {
        console.error("Highlighting error:", error);
      }
    };

    // Dynamically load language if not already loaded
    const loadLanguage = async () => {
      try {
        // Reset language loaded state
        setLanguageLoaded(false);

        // If a specific language import exists, load it
        if (languageImports[language]) {
          await languageImports[language]();
        }

        // Mark language as loaded and highlight
        setLanguageLoaded(true);
        highlightCode();
      } catch (error) {
        console.error(`Failed to load language ${language}:`, error);
        setLanguageLoaded(true);
      }
    };

    // Trigger language loading
    loadLanguage();
  }, [code, fileExtension]);

  // If no code, return null or a placeholder
  if (!code) return null;

  // Determine classes based on props
  const preClasses = [
    `language-${fileExtension || 'plaintext'}`,
    showLineNumbers ? 'line-numbers' : '',
    className,
    'code-block', // Added custom class for additional styling
  ].filter(Boolean).join(' ');

  return (
    <div className="syntax-highlighter-container">
      {title && (
        <div className="code-block-header">
          <span className="code-block-title">
            {title || `${fileExtension?.toUpperCase() || 'Code'} Snippet`}
          </span>
        </div>
      )}
      <pre 
        ref={codeRef}
        className={preClasses}
        style={{ 
          margin: 0, 
          borderRadius: '8px', 
          position: 'relative', 
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <code 
          className={`language-${fileExtension || 'plaintext'}`}
        >
          {code}
        </code>
      </pre>
    </div>
  );
};

// Add some additional global styles
const styles = `
/* Syntax Highlighter Container */
.syntax-highlighter-container {
  position: relative;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
}

/* Header */
.code-block-header {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 8px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.code-block-title {
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.7);
  font-weight: 500;
}

/* Code Block */
.code-block {
  transition: all 0.3s ease;
}

.code-block:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Copy Button */
.prism-toolbar {
  display: flex;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 6px 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0 0 8px 8px;
}

.prism-toolbar-item {
  cursor: pointer;
  font-size: 0.8rem;
  color: #007acc;
  background-color: transparent;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.prism-toolbar-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
`;


// Inject styles
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default SyntaxHighlighter;