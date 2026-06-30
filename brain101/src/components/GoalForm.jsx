import React from "react";
import { DATASETS, VOLUME_SIZES, ANALYSIS_TYPES, SCENARIOS } from "../utils/datasets.js";

const ACCESS_BADGE = {
  public: { label: "No auth needed", color: "#10b981" },
  free_token: { label: "Free token", color: "#f59e0b" },
};

export default function GoalForm({ formState, setFormState, onSubmit, loading, apiKey, onScenarioSelect, activeScenario }) {
  const { goal, dataset, datasetCustom, volumeSize, volumeCustom, analysisType, analysisCustom } =
    formState;

  function set(field) {
    return (e) => setFormState((s) => ({ ...s, [field]: e.target.value }));
  }

  const canSubmit = apiKey && goal.trim() && !loading;

  function handleScenarioChange(e) {
    const id = e.target.value;
    if (!id) return;
    const scenario = SCENARIOS.find((s) => s.id === id);
    if (scenario) onScenarioSelect(scenario);
  }

  return (
    <form
      className="form-card"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
    >
      <h2 className="form-heading">Define Your Analysis</h2>

      {/* Pre-configured scenarios */}
      <div className="form-group scenario-group">
        <label className="form-label" htmlFor="scenario">
          Quick Start — Pre-configured Scenario
        </label>
        <select id="scenario" className="select-field" defaultValue="" onChange={handleScenarioChange}>
          <option value="">— choose a scenario or fill in below —</option>
          {SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <p className="field-hint scenario-hint">
          Selecting a scenario pre-fills the form with verified working connection details.
        </p>
      </div>

      {/* Show active scenario info */}
      {activeScenario && (() => {
        const badge = ACCESS_BADGE[activeScenario.accessLevel];
        return (
          <div className="scenario-active-card">
            <div className="scenario-active-header">
              {badge && (
                <span
                  className="access-badge"
                  style={{
                    background: badge.color + "22",
                    color: badge.color,
                    borderColor: badge.color + "55",
                  }}
                >
                  {badge.label}
                </span>
              )}
            </div>
            <p className="scenario-description">{activeScenario.description}</p>
          </div>
        );
      })()}

      <div className="form-divider"><span>or define your own</span></div>

      {/* Research goal */}
      <div className="form-group">
        <label className="form-label" htmlFor="goal">
          Research Goal
        </label>
        <textarea
          id="goal"
          className="textarea-field"
          rows={4}
          value={goal}
          onChange={set("goal")}
          placeholder="e.g., Find all inhibitory neurons synaptically connected to a specific motor neuron in the fly brain and compare their morphologies."
        />
      </div>

      {/* Dataset */}
      <div className="form-group">
        <label className="form-label" htmlFor="dataset">
          Dataset
        </label>
        <select id="dataset" className="select-field" value={dataset} onChange={set("dataset")}>
          {DATASETS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
        {dataset !== "other" && (
          <p className="field-hint">
            {DATASETS.find((d) => d.id === dataset)?.info}
          </p>
        )}
        {dataset === "other" && (
          <input
            type="text"
            className="text-field mt-sm"
            value={datasetCustom}
            onChange={set("datasetCustom")}
            placeholder="CloudVolume path, DVID server URL, or description…"
          />
        )}
      </div>

      {/* Volume size */}
      <div className="form-group">
        <label className="form-label" htmlFor="volume-size">
          Volume Size
        </label>
        <select
          id="volume-size"
          className="select-field"
          value={volumeSize}
          onChange={set("volumeSize")}
        >
          {VOLUME_SIZES.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
        {volumeSize === "custom" && (
          <input
            type="text"
            className="text-field mt-sm"
            value={volumeCustom}
            onChange={set("volumeCustom")}
            placeholder="e.g., 50 µm³ or bounding box coordinates…"
          />
        )}
      </div>

      {/* Analysis type */}
      <div className="form-group">
        <label className="form-label" htmlFor="analysis-type">
          Analysis Type
        </label>
        <select
          id="analysis-type"
          className="select-field"
          value={analysisType}
          onChange={set("analysisType")}
        >
          {ANALYSIS_TYPES.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
        {analysisType === "custom" && (
          <textarea
            className="textarea-field mt-sm"
            rows={3}
            value={analysisCustom}
            onChange={set("analysisCustom")}
            placeholder="Describe the custom analysis you want to perform…"
          />
        )}
      </div>

      <button type="submit" className="btn-primary" disabled={!canSubmit}>
        {loading ? (
          <span className="btn-loading">
            <span className="spinner" />
            Generating…
          </span>
        ) : (
          "Generate Analysis Plan"
        )}
      </button>

      {!apiKey && (
        <p className="field-hint warning-hint">↑ Enter your Gemini API key above to continue.</p>
      )}
    </form>
  );
}
