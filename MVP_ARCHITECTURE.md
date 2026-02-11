# Step 0 — MVP Architecture (Vector-First)

## Selected pipeline

**Prompt (`"dog + rock"`) → LLM returns JSON spec → renderer builds SVG → UI controls re-render SVG**

This keeps the MVP deterministic and inspectable by using a strict JSON scene contract as the boundary between generation and rendering.

## Why this architecture

- **Deterministic rendering:** SVG output is generated from validated JSON rather than free-form model markup.
- **Fast iteration:** UI controls can mutate the JSON state and trigger a pure re-render without another LLM call.
- **Debuggable:** JSON spec can be logged, diffed, and replayed.
- **Safe defaults:** Schema validation prevents malformed shape data from breaking rendering.

## Core modules

1. **Prompt Orchestrator**
   - Accepts user text prompt.
   - Calls LLM with a system instruction that enforces structured JSON output.

2. **Spec Validator**
   - Validates model output against a JSON schema.
   - Applies defaults (stroke, fill, z-index, canvas size).

3. **SVG Renderer (pure function)**
   - Input: validated spec.
   - Output: SVG string.
   - No network calls or side effects.

4. **UI State + Controls**
   - Stores current JSON spec in client state.
   - Exposes controls (scale, color, stroke width, layer order, canvas size).
   - On change: mutate spec → call renderer → replace SVG.

## Suggested JSON scene contract (MVP)

```json
{
  "version": 1,
  "canvas": { "width": 512, "height": 512, "background": "#ffffff" },
  "elements": [
    {
      "id": "dog-body",
      "type": "ellipse",
      "x": 250,
      "y": 290,
      "rx": 120,
      "ry": 80,
      "fill": "#c58f5a",
      "stroke": "#333333",
      "strokeWidth": 2,
      "z": 1
    },
    {
      "id": "rock-1",
      "type": "path",
      "d": "M120 420 C160 380, 230 390, 260 430 Z",
      "fill": "#8d8d8d",
      "stroke": "#4f4f4f",
      "strokeWidth": 2,
      "z": 2
    }
  ]
}
```

## Rendering loop

1. User enters prompt (`"dog + rock"`).
2. LLM returns JSON spec only.
3. Validate + normalize spec.
4. Render SVG from spec.
5. User tweaks controls.
6. Controls update spec in state.
7. Re-render SVG instantly from updated spec.

## MVP non-goals

- No raster generation in MVP.
- No direct model-authored SVG in MVP.
- No animation system in MVP.
- No collaborative editing in MVP.

## Minimal acceptance criteria

- Given a prompt, app produces a valid JSON scene spec.
- Invalid spec is rejected with a user-friendly error.
- SVG is generated from spec and displayed.
- At least 3 UI controls re-render SVG without calling the LLM.
