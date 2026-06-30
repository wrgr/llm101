import React, { useState, useEffect } from "react";

const STORAGE_KEY = "brain101_gemini_key";

export default function ApiKeyInput({ apiKey, setApiKey }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setApiKey(stored);
  }, [setApiKey]);

  function handleChange(e) {
    const val = e.target.value;
    setApiKey(val);
    if (val) {
      localStorage.setItem(STORAGE_KEY, val);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return (
    <div className="api-key-card">
      <div className="form-group">
        <label className="form-label" htmlFor="gemini-key">
          Gemini API Key
        </label>
        <div className="api-key-row">
          <input
            id="gemini-key"
            type={visible ? "text" : "password"}
            className="text-field"
            value={apiKey}
            onChange={handleChange}
            placeholder="AIza..."
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            className="btn-icon"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide key" : "Show key"}
          >
            {visible ? "🙈" : "👁️"}
          </button>
        </div>
        <p className="field-hint">
          Free key at{" "}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            aistudio.google.com
          </a>{" "}
          — stored only in your browser, never sent to our servers.
        </p>
      </div>
    </div>
  );
}
