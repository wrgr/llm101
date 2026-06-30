import React from "react";

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-brand">
          <span className="header-logo" aria-hidden="true">🧠</span>
          <div>
            <h1 className="header-title">Brain101</h1>
            <p className="header-subtitle">Connectomics Explorer — powered by Gemini AI</p>
          </div>
        </div>
        <nav className="header-nav">
          <span className="header-tagline">Query · Visualize · Analyze · Reproduce</span>
          <a
            href="https://github.com/wrgr/llm101/tree/main/brain101"
            target="_blank"
            rel="noopener noreferrer"
            className="header-link"
          >
            GitHub
          </a>
        </nav>
      </div>
      <div className="header-accent-line" />
    </header>
  );
}
