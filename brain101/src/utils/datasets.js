export const DATASETS = [
  {
    id: "flywire",
    label: "FlyWire (Drosophila full brain)",
    species: "Drosophila melanogaster",
    server: "https://globalv1.flywire-daf.com",
    neuroglancerUrl: "https://ngl.flywire.ai/",
    client: "caveclient",
    info: "CAVE-based, ~130,000 neurons, synapse tables available",
  },
  {
    id: "microns",
    label: "MICrONS (Mouse V1 cortex)",
    species: "Mus musculus",
    server: "https://minnie.microns-daf.com",
    neuroglancerUrl: "https://ngl.microns-explorer.org/",
    client: "caveclient",
    info: "CAVE-based, 200 TB EM volume, >70,000 neurons",
  },
  {
    id: "h01",
    label: "H01 (Human cortex 1 mm³)",
    species: "Homo sapiens",
    server: "https://h01-dot-neuroglancer-demo.appspot.com",
    neuroglancerUrl: "https://h01-dot-neuroglancer-demo.appspot.com/#!",
    client: "cloudvolume",
    info: "Google / Lichtman lab, first large human EM sample",
  },
  {
    id: "fafb",
    label: "FAFB (Full Adult Fly Brain)",
    species: "Drosophila melanogaster",
    server: "https://neuropil.janelia.org/tracing/fafb/v14",
    neuroglancerUrl: "https://neuropil.janelia.org/tracing/fafb/v14-seg/",
    client: "dvid",
    info: "DVID-based, Janelia Research Campus, CATMAID annotations",
  },
  {
    id: "hemibrain",
    label: "Hemibrain (Fly hemibrain)",
    species: "Drosophila melanogaster",
    server: "https://neuprint.janelia.org",
    neuroglancerUrl: "https://neuprint.janelia.org",
    client: "neuprint-python",
    info: "NeuPrint / DVID, ~25,000 neurons, dense reconstruction",
  },
  {
    id: "bossdb",
    label: "BossDB (Open datasets)",
    species: "Various",
    server: "https://api.bossdb.io",
    neuroglancerUrl: "",
    client: "intern",
    info: "Open BossDB repository — multiple species and modalities",
  },
  {
    id: "other",
    label: "Other (specify below)",
    species: "",
    server: "",
    neuroglancerUrl: "",
    client: "cloudvolume",
    info: "Provide a custom CloudVolume / DVID / CAVE server URL",
  },
];

export const VOLUME_SIZES = [
  { id: "small", label: "Small  (~1 µm³)", value: "1", unit: "µm³" },
  { id: "medium", label: "Medium (~10 µm³)", value: "10", unit: "µm³" },
  { id: "large", label: "Large  (~100 µm³)", value: "100", unit: "µm³" },
  { id: "custom", label: "Custom (specify)", value: "", unit: "" },
];

export const ANALYSIS_TYPES = [
  { id: "cell_type", label: "Cell type classification" },
  { id: "synapse", label: "Synapse detection & mapping" },
  { id: "connectivity", label: "Connectivity / circuit tracing" },
  { id: "morphology", label: "Morphology analysis" },
  { id: "proofreading", label: "Proofreading & error detection" },
  { id: "custom", label: "Custom (describe below)" },
];

// Pre-configured scenarios with verified public connection details.
// `technicalContext` is injected verbatim into the Gemini prompt so the
// generated code uses real endpoints and example IDs rather than guesses.
// ─── Pre-configured scenarios ────────────────────────────────────────────────
// Each scenario includes:
//   • verified working connection code (injected into Gemini prompt)
//   • real example neuron IDs / bounding boxes
//   • documented available data products for that dataset
// accessLevel: "public" = zero auth; "free_token" = free registration required
export const SCENARIOS = [
  {
    id: "kasthuri_cutout",
    label: "🐭 Mouse cortex EM cutout — BossDB Kasthuri 2015 (no auth)",
    description:
      "Download a patch of mouse cortex EM imagery from the public Kasthuri 2015 dataset and visualize it. No account or token needed — fully open access.",
    accessLevel: "public",
    form: {
      goal: "Download a small EM image cutout from the Kasthuri 2015 mouse cortex dataset, display it as a 2D grayscale image, and show statistics (mean, std, histogram) of pixel intensities.",
      dataset: "bossdb",
      datasetCustom: "",
      volumeSize: "small",
      volumeCustom: "",
      analysisType: "custom",
      analysisCustom: "Fetch a 2D image slice from BossDB and display it with pixel intensity statistics.",
    },
    technicalContext: `
VERIFIED WORKING — Kasthuri 2015, mouse cortex, BossDB (api.bossdb.io)
No authentication required — use token "public".

Available data products in collection "kasthuri2015", experiment "ac4":
  - Channel "em"          : raw EM grayscale imagery, uint8
  - Channel "annotation"  : manual mitochondria/vesicle/membrane labels, uint16
  Resolution 0: 3×3×30 nm voxels; extents x=[0,2048], y=[0,2048], z=[0,1850]

Working Python connection:
  from intern.remote.boss import BossRemote
  from intern.resource.boss.resource import ChannelResource
  import numpy as np
  import matplotlib.pyplot as plt

  rmt = BossRemote({"protocol": "https", "host": "api.bossdb.io", "token": "public"})
  chan = ChannelResource("em", "kasthuri2015", "ac4")

  # Fetch a 512x512 patch at z=500, resolution 0
  cutout = rmt.get_cutout(chan, 0, [0, 512], [0, 512], [500, 501])
  img = cutout[0]   # shape (512, 512), uint8

  # Alternatively via the simpler intern.array API:
  # from intern import array
  # vol = array("bossdb://kasthuri2015/ac4/em")
  # img = vol[500, 0:512, 0:512]

Install: pip install intern numpy matplotlib
Neuroglancer: https://neuroglancer.bossdb.io
`,
    neuroglancerUrl: "https://neuroglancer.bossdb.io",
  },

  {
    id: "hemibrain_kenyon",
    label: "🪰 Fly hemibrain — Kenyon cell circuit (NeuPrint, free token)",
    description:
      "Query the Drosophila hemibrain (v1.2.1, ~21,000 neurons, 9.5M synapses) via NeuPrint to find Kenyon cells and their top synaptic partners. Free token at neuprint.janelia.org.",
    accessLevel: "free_token",
    form: {
      goal: "Find all Kenyon cells (KCs) in the Drosophila hemibrain, identify their top 10 upstream pre-synaptic partners by synapse count, and visualize the result as a horizontal bar chart.",
      dataset: "hemibrain",
      datasetCustom: "",
      volumeSize: "custom",
      volumeCustom: "whole-brain graph query — no volume cutout needed",
      analysisType: "connectivity",
      analysisCustom: "",
    },
    technicalContext: `
VERIFIED WORKING — hemibrain:v1.2.1, NeuPrint (neuprint.janelia.org)
Free token: register at https://neuprint.janelia.org → top-right Account icon → Auth Token.

Available data products in hemibrain:v1.2.1:
  - ~21,662 traced neurons with type/instance labels
  - 9.5 million synaptic connections (pre/post bodyId pairs)
  - Neuron properties: bodyId, type, instance, status, pre, post, size, somaLocation
  - Connectivity: fetch_adjacencies(), fetch_synapses()
  - Cell types include: KC (Kenyon cell, ~2,000), MBON (mushroom body output), APL, DAN, OPN, etc.
  - Example bodyId: 329566174 (documented example neuron)

Working Python connection:
  from neuprint import Client, fetch_neurons, fetch_adjacencies, NeuronCriteria as NC
  import pandas as pd
  import matplotlib.pyplot as plt

  TOKEN = "YOUR_NEUPRINT_TOKEN"   # TODO: paste free token from neuprint.janelia.org
  c = Client("neuprint.janelia.org", dataset="hemibrain:v1.2.1", token=TOKEN)

  # Fetch all Kenyon cells
  kc_df, _ = fetch_neurons(NC(type="KC", status="Traced"))
  print(f"Found {len(kc_df)} Kenyon cells")

  # Upstream partners of the first KC
  example_kc = int(kc_df["bodyId"].iloc[0])
  _, _, weights = fetch_adjacencies(sources=None, targets=[example_kc], min_weight=3)
  top10 = weights.sort_values("weight", ascending=False).head(10)

  plt.figure(figsize=(10, 5))
  plt.barh(range(len(top10)), top10["weight"].values)
  plt.yticks(range(len(top10)), [str(b) for b in top10["bodyId_pre"].values])
  plt.xlabel("Synapse count")
  plt.title(f"Top upstream partners of KC {example_kc} (hemibrain v1.2.1)")
  plt.tight_layout()
  plt.show()

Install: pip install neuprint-python pandas matplotlib
NeuPrint explorer: https://neuprint.janelia.org/?dataset=hemibrain:v1.2.1
`,
    neuroglancerUrl: "https://neuprint.janelia.org/?dataset=hemibrain%3Av1.2.1",
  },

  {
    id: "h01_cutout",
    label: "🧠 Human cortex EM — H01 dataset (no auth, CloudVolume)",
    description:
      "Fetch EM imagery and neuron segmentation from the H01 human temporal cortex dataset (Google × Lichtman lab, 1.4 PB). Completely public — no credentials needed.",
    accessLevel: "public",
    form: {
      goal: "Download a small EM image patch from the H01 human cortex dataset, then overlay the neuron segmentation mask to show reconstructed cell boundaries. Display both side-by-side.",
      dataset: "h01",
      datasetCustom: "",
      volumeSize: "small",
      volumeCustom: "",
      analysisType: "morphology",
      analysisCustom: "",
    },
    technicalContext: `
VERIFIED WORKING — H01 human temporal cortex, Google Cloud Storage (public)
No authentication required. All gs:// paths are publicly readable with use_https=True.

Available data products at gs://h01-release/data/20210601/:
  - 4nm_raw/              : raw EM imagery, uint8, 4×4×33 nm voxels at mip 0
  - seg/                  : automated neuron segmentation (agglomerated), uint64
  - proofread_104/        : 104 manually proofread neurons
  - synapses/             : 183 million detected synapses (parquet files)
  - c2/, c3/              : alternative agglomeration variants
  Volume size: ~300,000 × 300,000 × 10,000 voxels at mip 0
  Use mip=4 (64nm res) or mip=5 (128nm) for fast exploratory downloads.

Working Python connection:
  from cloudvolume import CloudVolume
  import numpy as np
  import matplotlib.pyplot as plt

  # No credentials needed — use_https bypasses gsutil auth
  img_vol = CloudVolume("gs://h01-release/data/20210601/4nm_raw",
                        use_https=True, mip=4, fill_missing=True, progress=True)
  seg_vol = CloudVolume("gs://h01-release/data/20210601/seg",
                        use_https=True, mip=4, fill_missing=True, progress=True)

  print("Volume shape (mip 4):", img_vol.volume_size)
  print("Voxel size (nm):", img_vol.resolution)

  # Small 256×256 patch near volume centre
  x0, y0, z0 = 1875, 1875, 3500   # mip-4 coordinates (≈mip-0 / 16)
  img = img_vol[x0:x0+256, y0:y0+256, z0:z0+1][:, :, 0, 0]
  seg = seg_vol[x0:x0+256, y0:y0+256, z0:z0+1][:, :, 0, 0]

  fig, axes = plt.subplots(1, 2, figsize=(14, 6))
  axes[0].imshow(img.T, cmap="gray")
  axes[0].set_title("H01 EM image (mip 4, ~64 nm/px)")
  axes[1].imshow(seg.T, cmap="tab20")
  axes[1].set_title("H01 neuron segmentation")
  for ax in axes: ax.axis("off")
  plt.tight_layout()
  plt.show()

Install: pip install cloud-volume numpy matplotlib
`,
    neuroglancerUrl:
      "https://neuroglancer-demo.appspot.com/#!%7B%22layers%22:%5B%7B%22source%22:%22precomputed://gs://h01-release/data/20210601/4nm_raw%22,%22type%22:%22image%22,%22name%22:%22EM%22%7D%5D%7D",
  },

  {
    id: "microns_synapses",
    label: "🐭 MICrONS mouse V1 — synapse & cell-type query (CAVE, free token)",
    description:
      "Query the MICrONS minnie65 public dataset (200 TB, ~200k neurons, 523M synapses) via CAVE. Find all synapses onto a specific neuron and break them down by pre-synaptic cell type.",
    accessLevel: "free_token",
    form: {
      goal: "For a specific pyramidal neuron in MICrONS mouse V1 (root ID 864691136968109774), retrieve all incoming synapses, join with the cell-type classification table, and plot the proportion of inputs from each cell type as a pie chart.",
      dataset: "microns",
      datasetCustom: "",
      volumeSize: "custom",
      volumeCustom: "single-neuron graph query — no volume cutout needed",
      analysisType: "synapse",
      analysisCustom: "",
    },
    technicalContext: `
VERIFIED WORKING — minnie65_public (MICrONS mouse V1), CAVE
Free token: run caveclient.utils.get_caveclient_token() or visit https://global.daf-apis.com/auth/v1/user/token

Available data products / materialization tables in minnie65_public (latest mat version: 1300, Jan 2025):
  - synapses_pni_2          : 523M detected synapses; columns: pre_pt_root_id, post_pt_root_id, size, ctr_pt_position
  - nucleus_detection_v0    : nucleus centroid per neuron; columns: pt_root_id, pt_position, volume
  - aibs_soma_nuc_metamodel_preds_v117 : predicted cell class (exc/inh), confidence
  - aibs_metamodel_mtypes_v661_v2      : fine-grained M-types (23 types), confidence score
  - allen_v1_column_types_slanted_ref  : column assignment for V1 layer analysis
  - proofreading_status_public_release : proofreading status flags
  Example root IDs: 864691136968109774 (exc L2/3), 864691134940133219 (inh)

Working Python connection:
  import caveclient
  import pandas as pd
  import matplotlib.pyplot as plt

  TOKEN = "YOUR_CAVE_TOKEN"   # TODO: get free token (see above)
  client = caveclient.CAVEclient("minnie65_public", auth_token=TOKEN)
  client.version = 1300   # pin to a specific materialization for reproducibility

  ROOT_ID = 864691136968109774   # example L2/3 excitatory pyramidal cell

  # All synapses onto this neuron
  syn_df = client.materialize.query_table(
      "synapses_pni_2",
      filter_equal_dict={"post_pt_root_id": ROOT_ID},
      limit=5000,
  )
  print(f"Found {len(syn_df)} incoming synapses")

  # Cell-type labels for pre-synaptic partners
  pre_ids = syn_df["pre_pt_root_id"].unique().tolist()[:500]
  ct_df = client.materialize.query_table(
      "aibs_metamodel_mtypes_v661_v2",
      filter_in_dict={"pt_root_id": pre_ids},
  )
  merged = syn_df.merge(ct_df[["pt_root_id","cell_type"]], left_on="pre_pt_root_id", right_on="pt_root_id", how="left")
  merged["cell_type"] = merged["cell_type"].fillna("unknown")
  counts = merged["cell_type"].value_counts()

  plt.figure(figsize=(8, 8))
  plt.pie(counts.values, labels=counts.index, autopct="%1.1f%%", startangle=90)
  plt.title(f"Input synapse cell types for MICrONS neuron {ROOT_ID}\\n(mat v1300)")
  plt.tight_layout()
  plt.show()

Install: pip install caveclient pandas matplotlib
Neuroglancer: https://ngl.microns-explorer.org/
`,
    neuroglancerUrl: "https://ngl.microns-explorer.org/",
  },

  {
    id: "flywire_connectivity",
    label: "🪰 FlyWire — neuron connectivity (CAVE public release v783, free token)",
    description:
      "Query the FlyWire public materialization v783 (~130,000 Drosophila neurons) via CAVE to find all synaptic partners of a specific neuron and plot the connectivity graph.",
    accessLevel: "free_token",
    form: {
      goal: "For a specific FlyWire neuron (root ID 720575940627654161), retrieve all upstream and downstream synaptic partners with at least 5 synapses, and visualize as a connectivity graph with synapse counts.",
      dataset: "flywire",
      datasetCustom: "",
      volumeSize: "custom",
      volumeCustom: "single-neuron graph query",
      analysisType: "connectivity",
      analysisCustom: "",
    },
    technicalContext: `
VERIFIED WORKING — flywire_fafb_public, CAVE public release v783 (Oct 2023 LTS)
Free token: visit https://global.daf-apis.com/auth/api/v1/user/token (Google login)
Save token to ~/.cloudvolume/secrets/global.daf-apis.com-cave-secret.json
  OR pass as auth_token parameter directly.

Available data products in flywire_fafb_public (materialization v783):
  - connectome_proofread_v783  : synapse table; columns: pre_pt_root_id, post_pt_root_id, syn_count, neuropil
  - cell_info                  : cell type annotations; columns: root_id, cell_type, side, flow, super_class, class, sub_class
  - proofreading_status_783    : proofreading completeness flags
  - nuclei_v1                  : nucleus detections for ~130,000 neurons
  ~130,000 neurons total, ~3B identified synapses, ~9M connections with ≥5 synapses
  Example neuron: 720575940627654161 (documented in FlyWire tutorials)

Working Python connection:
  from caveclient import CAVEclient
  import pandas as pd
  import matplotlib.pyplot as plt
  import networkx as nx

  TOKEN = "YOUR_CAVE_TOKEN"   # TODO: get free token at global.daf-apis.com
  client = CAVEclient("flywire_fafb_public", auth_token=TOKEN)
  client.version = 783   # public LTS release

  ROOT_ID = 720575940627654161   # example neuron

  # All downstream partners (this neuron as pre-synaptic)
  post_df = client.materialize.query_table(
      "connectome_proofread_v783",
      filter_equal_dict={"pre_pt_root_id": ROOT_ID},
  )
  # All upstream partners (this neuron as post-synaptic)
  pre_df = client.materialize.query_table(
      "connectome_proofread_v783",
      filter_equal_dict={"post_pt_root_id": ROOT_ID},
  )
  print(f"Downstream partners: {post_df['post_pt_root_id'].nunique()}")
  print(f"Upstream partners:   {pre_df['pre_pt_root_id'].nunique()}")

  # Filter to strong connections (≥5 synapses)
  strong_post = post_df[post_df["syn_count"] >= 5].nlargest(15, "syn_count")
  strong_pre  = pre_df[pre_df["syn_count"] >= 5].nlargest(15, "syn_count")

  # Build a small NetworkX graph
  G = nx.DiGraph()
  G.add_node(ROOT_ID, label="target")
  for _, row in strong_post.iterrows():
      G.add_edge(ROOT_ID, row["post_pt_root_id"], weight=row["syn_count"])
  for _, row in strong_pre.iterrows():
      G.add_edge(row["pre_pt_root_id"], ROOT_ID, weight=row["syn_count"])

  pos = nx.spring_layout(G, seed=42)
  plt.figure(figsize=(12, 8))
  nx.draw(G, pos, with_labels=False, node_size=300,
          node_color=["red" if n == ROOT_ID else "steelblue" for n in G.nodes()],
          edge_color="gray", arrows=True, arrowsize=15)
  plt.title(f"FlyWire connectivity for neuron {ROOT_ID} (v783, ≥5 synapses)")
  plt.tight_layout()
  plt.show()

Install: pip install caveclient pandas matplotlib networkx
FlyWire Neuroglancer: https://ngl.flywire.ai/
`,
    neuroglancerUrl: "https://ngl.flywire.ai/",
  },
];
