# Generation Prompt And Provenance Record

Mode: built-in image generation, followed by local chroma removal and deterministic assembly. The Museum source crop was supplied as a visual reference for palette, camera, lighting, and material continuity; generated outputs were not asked to reproduce it as one fused image.

## Prompt Set

### Clean Field

Edit the supplied lower-left Museum crop into a clean dark rocky field and basin. Remove the coral cluster, cyan organism, rings, luminous current, and nearby particulate overlays while preserving the same impossible-observatory camera, black mineral terrain, subtle cyan/amber reflected light, and small illuminated book fragment. Produce a complete background repair with no ghost silhouettes or rectangular insert.

### Rooted Coral Groups

Create one isolated family of rooted alien coral fans and fine branching fronds for a dark impossible observatory. Match bone, amber, coral-orange, faint cyan, translucent filament, and bioluminescent-tip materials. Preserve a stable planted root zone and generous empty margins for deformation. No ground, shadows, labels, frame, or other objects. Flat green chroma background.

### Organism Instrument

Create an isolated cyan-and-amber organism instrument: a rooted dark porous body with translucent turquoise membranes, luminous orange bulbs, delicate filaments, and two separate circular receiver rings placed beside the body. Front three-quarter camera, dark observatory material language, generous margins, no ground or cast shadow. Flat green chroma background.

### Directional Current

Create one isolated lateral signal current made from fine cyan and warm-gold filaments, traveling continuously left to right with varying width, ring-like emissions, sparse particles, and coherent directional flow. No landscape, objects, text, frame, or baked shadow. Flat green chroma background.

### Atmosphere Volumes

Create an isolated sprite sheet containing three dark translucent atmospheric forms: a broad far vapor volume, a narrow vertical interstitial wisp, and a shallow basin mist ribbon. Use smoky blue, cyan, muted violet, and near-black detail with soft irregular boundaries and generous separation. No terrain, frame, or text. Flat magenta chroma background.

### Near Occluders

Create an isolated sprite sheet of sparse Museum foreground matter: tiny luminous spores, drifting organic fragments, translucent nodules, and two low dark semi-transparent passing organisms. Keep every sprite separated with generous margins, consistent cyan/amber/coral highlights, and no ground, frame, or text. Flat green chroma background.

## Cleanup

Chroma sources were converted to alpha with the imagegen skill's `remove_chroma_key.py` helper using border-key detection, soft matte, despill, a transparent threshold of `12`, and an opaque threshold of `220`. `alpha-edge-diagnostics.png` records the retained result over black, white, and checkerboard backgrounds.
