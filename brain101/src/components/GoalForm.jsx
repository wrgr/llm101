import React from "react";
import { DATASETS, VOLUME_SIZES, ANALYSIS_TYPES } from "../utils/datasets.js";

export default function GoalForm({ formState, setFormState, onSubmit, loading, apiKey }) {
  const { goal, dataset, datasetCustom, volumeSize, volumeCustom, analysisType, analysisCustom } =
    formState;

  function set(field) {
    return (e) => setFormState((s) => ({ ...s, [field]: e.target.value }));
  }

  const canSubmit = apiKey && goal.trim() && !loading;

  return (
    <form
      className="form-card"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
    >
      <h2 className="form-heading">Define Your Analysis</h2>

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
