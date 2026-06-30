import React, { useState } from "react";
import Header from "./components/Header.jsx";
import ApiKeyInput from "./components/ApiKeyInput.jsx";
import GoalForm from "./components/GoalForm.jsx";
import ResultPanel from "./components/ResultPanel.jsx";
import { generateConnectomicsAnalysis } from "./utils/gemini.js";
import { generateNotebook, downloadNotebook } from "./utils/notebook.js";
import { DATASETS } from "./utils/datasets.js";
import { buildNeuroglancerUrl } from "./utils/neuroglancer.js";

const DEFAULT_FORM = {
  goal: "",
  dataset: "flywire",
  datasetCustom: "",
  volumeSize: "small",
  volumeCustom: "",
  analysisType: "connectivity",
  analysisCustom: "",
};

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [formState, setFormState] = useState(DEFAULT_FORM);
  const [activeScenario, setActiveScenario] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleScenarioSelect(scenario) {
    setActiveScenario(scenario);
    setFormState((s) => ({ ...s, ...scenario.form }));
    setResult(null);
    setError(null);
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await generateConnectomicsAnalysis({
        apiKey,
        ...formState,
        technicalContext: activeScenario?.technicalContext || "",
      });
      // Inject a neuroglancer URL from our dataset list if Gemini didn't return one
      if (!data.neuroglancerUrl) {
        data.neuroglancerUrl = buildNeuroglancerUrl(formState.dataset);
      }
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadNotebook() {
    if (!result) return;
    const ds = DATASETS.find((d) => d.id === formState.dataset);
    const title = `Brain101 – ${ds?.label || "Connectomics"} Analysis`;
    const nb = generateNotebook(result.notebookCells || [], {
      title,
      libraries: result.libraries || [],
    });
    const safeName = title.toLowerCase().replace(/[^a-z0-9]+/g, "_") + ".ipynb";
    downloadNotebook(nb, safeName);
  }

  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        <aside className="left-panel">
          <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
          <GoalForm
            formState={formState}
            setFormState={setFormState}
            onSubmit={handleSubmit}
            loading={loading}
            apiKey={apiKey}
            onScenarioSelect={handleScenarioSelect}
            activeScenario={activeScenario}
          />
        </aside>
        <main className="right-panel">
          {error && (
            <div className="error-banner" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}
          {!result && !error && !loading && (
            <div className="empty-state">
              <div className="empty-icon">🔬</div>
              <h2 className="empty-heading">Ready to explore connectomics data</h2>
              <p className="empty-text">
                Enter your Gemini API key, describe your research goal, choose a dataset
                and analysis type, then click <strong>Generate Analysis Plan</strong>.
              </p>
              <ul className="empty-features">
                <li>📦 AI-generated Python code using CAVE, BossDB, DVID &amp; CloudVolume</li>
                <li>🔭 Neuroglancer visualization links &amp; embeds</li>
                <li>📓 Download a ready-to-run Jupyter notebook</li>
                <li>🔐 Your API key never leaves your browser</li>
              </ul>
            </div>
          )}
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner-lg" />
              <p className="loading-text">Gemini is generating your analysis plan…</p>
            </div>
          )}
          <ResultPanel result={result} onDownloadNotebook={handleDownloadNotebook} />
        </main>
      </div>
    </div>
  );
}
