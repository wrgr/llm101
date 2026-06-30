import React, { useState } from "react";
import { isEmbeddable } from "../utils/neuroglancer.js";

export default function ResultPanel({ result, onDownloadNotebook }) {
  const [codeCopied, setCodeCopied] = useState(false);
  const [libCopied, setLibCopied] = useState(false);

  if (!result) return null;

  const { summary, neuroglancerUrl, pythonCode, libraries = [], caveatNotes } = result;

  async function copyText(text, setCopied) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  const pipCmd = `pip install ${libraries.join(" ")}`;

  return (
    <div className="result-panel">

      {/* Summary */}
      <section className="result-section">
        <h2 className="section-heading">Analysis Plan</h2>
        <p className="summary-text">{summary}</p>
      </section>

      {/* Libraries */}
      {libraries.length > 0 && (
        <section className="result-section">
          <h2 className="section-heading">Required Libraries</h2>
          <div className="code-block-wrapper">
            <pre className="code-block lib-block"><code>{pipCmd}</code></pre>
            <button
              className="copy-btn"
              onClick={() => copyText(pipCmd, setLibCopied)}
              aria-label="Copy pip install command"
            >
              {libCopied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </section>
      )}

      {/* Neuroglancer */}
      {neuroglancerUrl && (
        <section className="result-section">
          <h2 className="section-heading">Visualization</h2>
          <div className="viz-actions">
            <a
              href={neuroglancerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Open in Neuroglancer ↗
            </a>
          </div>
          {isEmbeddable(neuroglancerUrl) && (
            <iframe
              src={neuroglancerUrl}
              className="neuroglancer-embed"
              title="Neuroglancer viewer"
              allow="fullscreen"
            />
          )}
        </section>
      )}

      {/* Python Code */}
      {pythonCode && (
        <section className="result-section">
          <h2 className="section-heading">Generated Python Code</h2>
          <div className="code-block-wrapper">
            <pre className="code-block python-block"><code>{pythonCode}</code></pre>
            <button
              className="copy-btn"
              onClick={() => copyText(pythonCode, setCodeCopied)}
              aria-label="Copy Python code"
            >
              {codeCopied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </section>
      )}

      {/* Download notebook */}
      <section className="result-section">
        <button className="btn-primary download-btn" onClick={onDownloadNotebook}>
          ⬇ Download .ipynb Notebook
        </button>
        <p className="field-hint">
          Open in Jupyter, Google Colab, or VS Code to run and modify your analysis.
        </p>
      </section>

      {/* Caveats */}
      {caveatNotes && (
        <section className="result-section">
          <div className="caveats-box">
            <h3 className="caveats-heading">⚠ Notes & Access Requirements</h3>
            <p className="caveats-text">{caveatNotes}</p>
          </div>
        </section>
      )}
    </div>
  );
}
