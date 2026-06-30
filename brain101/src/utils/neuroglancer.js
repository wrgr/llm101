import { DATASETS } from "./datasets.js";

export function buildNeuroglancerUrl(datasetId) {
  const ds = DATASETS.find((d) => d.id === datasetId);
  return ds?.neuroglancerUrl || "";
}

// Only these origins allow cross-origin iframe embedding
const EMBEDDABLE_ORIGINS = [
  "ngl.flywire.ai",
  "ngl.microns-explorer.org",
];

export function isEmbeddable(url) {
  if (!url) return false;
  try {
    const { hostname } = new URL(url);
    return EMBEDDABLE_ORIGINS.some((o) => hostname === o || hostname.endsWith("." + o));
  } catch {
    return false;
  }
}
