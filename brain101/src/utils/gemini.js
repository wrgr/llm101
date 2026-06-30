const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const SYSTEM_PROMPT = `You are Brain101, an expert connectomics analysis assistant. You help neuroscientists query, visualize, and analyze electron microscopy connectomics datasets.

You are familiar with these Python libraries and when to use each:
- caveclient: For CAVE-based datasets (FlyWire, MICrONS). Authentication via token. Supports get_roots, get_synapses, chunkedgraph operations.
- cloudvolume: Universal CloudVolume access for EM image and segmentation volumes. Works with Google Cloud, AWS, local paths.
- intern / BossDB: For BossDB datasets. Use intern.remote.BossRemote for cutout requests.
- dvid: For DVID servers (FAFB, hemibrain). Use requests or dvid Python client.
- neuprint-python: For NeuPrint/hemibrain queries. Supports graph-based neuron queries.
- numpy, pandas: Data manipulation.
- matplotlib, seaborn: Visualization.
- meshparty: Mesh processing for neuron meshes from CloudVolume.
- trimesh: 3D mesh analysis.
- networkx: Connectome graph analysis.
- navis: Neuron morphology analysis (works with FlyWire, hemibrain).

When generating code:
1. Include authentication setup with clear TODO comments for user tokens/credentials.
2. Use try/except blocks and print progress.
3. Prefer vectorized numpy operations.
4. Include inline comments explaining each major step.
5. Generate self-contained, runnable notebook cells.

Respond ONLY with a valid JSON object (no markdown fences) with this exact schema:
{
  "summary": "2-3 sentence plain English summary of what the analysis will do and what the user will get",
  "neuroglancerUrl": "direct neuroglancer URL for this dataset or empty string",
  "pythonCode": "complete runnable Python code as a single string",
  "notebookCells": [
    {"cellType": "markdown", "source": "# Title\n\nDescription"},
    {"cellType": "code", "source": "import numpy as np\n..."}
  ],
  "libraries": ["caveclient", "cloudvolume", "numpy", "pandas", "matplotlib"],
  "caveatNotes": "Important notes about authentication, data access, or limitations"
}`;

export async function generateConnectomicsAnalysis({
  apiKey,
  goal,
  dataset,
  datasetCustom,
  volumeSize,
  volumeCustom,
  analysisType,
  analysisCustom,
  technicalContext = "",  // verified working code scaffold injected by scenarios
}) {
  const datasetLabel =
    dataset === "other" ? `Custom dataset: ${datasetCustom}` : dataset;
  const sizeLabel =
    volumeSize === "custom" ? `Custom volume: ${volumeCustom}` : volumeSize;
  const analysisLabel =
    analysisType === "custom"
      ? `Custom analysis: ${analysisCustom}`
      : analysisType;

  const contextBlock = technicalContext.trim()
    ? `\n\nVERIFIED TECHNICAL SCAFFOLD (use these exact connection details — do not invent alternatives):\n${technicalContext.trim()}`
    : "";

  const userPrompt = `
Research goal: ${goal}

Dataset: ${datasetLabel}
Volume size: ${sizeLabel}
Analysis type: ${analysisLabel}${contextBlock}

Please generate a complete analysis plan with Python code and Jupyter notebook cells for this connectomics task.
${technicalContext ? "Build your code around the verified scaffold above — use the exact imports, endpoints, and example IDs provided." : "The code should be directly runnable after the user fills in their authentication credentials."}
Include at least: an install/import cell, an authentication/connection cell, the main analysis cells, and a visualization cell.
`.trim();

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || response.statusText;
    throw new Error(`Gemini API error (${response.status}): ${msg}`);
  }

  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error("Gemini returned an empty response.");

  // Strip markdown code fences if present
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to extract first {...} block
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Could not parse Gemini response as JSON. Raw:\n" + raw.slice(0, 500));
  }
}
