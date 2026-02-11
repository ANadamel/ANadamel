"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { defaultSpec } from "@/lib/default-spec";
import { downloadBlob, downloadTextFile, exportSvgAsPng } from "@/lib/exporters";
import { IconSpec } from "@/lib/icon-spec";
import { renderSvg } from "@/lib/render-svg";
import { saveIcon } from "@/lib/storage";

export default function HomePage() {
  const [prompt, setPrompt] = useState("dog + rock");
  const [variations, setVariations] = useState<IconSpec[]>([defaultSpec, defaultSpec, defaultSpec, defaultSpec, defaultSpec, defaultSpec]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeSpec = variations[activeIndex] ?? defaultSpec;
  const svgMarkup = useMemo(() => renderSvg(activeSpec), [activeSpec]);

  const updateSpec = (next: IconSpec) => {
    setVariations((prev) => prev.map((item, idx) => (idx === activeIndex ? next : item)));
  };

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-icon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = (await res.json()) as { error?: string; variations?: IconSpec[] };
      if (!res.ok || !data.variations) {
        throw new Error(data.error ?? "Generation failed.");
      }
      setVariations(data.variations);
      setActiveIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate icons.");
    } finally {
      setLoading(false);
    }
  }

  async function onExportPng() {
    const png = await exportSvgAsPng(svgMarkup);
    downloadBlob("icon.png", png);
  }

  function onSave() {
    saveIcon({
      name: prompt.slice(0, 48) || "Untitled icon",
      prompt,
      spec: activeSpec
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Icon Generator</h1>
          <p className="text-sm text-slate-600">Prompt → JSON spec → deterministic SVG renderer.</p>
        </div>
        <Link href="/library" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium">
          Open Library
        </Link>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Prompt</label>
            <div className="flex gap-2">
              <input value={prompt} onChange={(e) => setPrompt(e.target.value)} className="flex-1" placeholder="dog + rock" />
              <button onClick={handleGenerate} disabled={loading}>{loading ? "Generating..." : "Generate"}</button>
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold">6 Variations</h2>
            <div className="grid grid-cols-3 gap-3">
              {variations.map((spec, index) => {
                const thumb = renderSvg(spec);
                return (
                  <button
                    key={index}
                    className={`aspect-square border p-1 ${index === activeIndex ? "border-blue-600" : "border-slate-300"}`}
                    onClick={() => setActiveIndex(index)}
                    type="button"
                  >
                    <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: thumb }} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 rounded-md bg-slate-50 p-3">
            <h2 className="text-sm font-semibold">Control Panel</h2>
            <label className="block text-xs">Mode</label>
            <select
              value={activeSpec.mode}
              onChange={(e) => updateSpec({ ...activeSpec, mode: e.target.value as IconSpec["mode"] })}
            >
              <option value="outline">outline</option>
              <option value="solid">solid</option>
            </select>

            <label className="block text-xs">Stroke Width: {activeSpec.strokeWidth}</label>
            <input
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={activeSpec.strokeWidth}
              onChange={(e) => updateSpec({ ...activeSpec, strokeWidth: Number(e.target.value) })}
            />

            <label className="block text-xs">Corner Radius: {activeSpec.cornerRadius}</label>
            <input
              type="range"
              min={0}
              max={48}
              step={1}
              value={activeSpec.cornerRadius}
              onChange={(e) => updateSpec({ ...activeSpec, cornerRadius: Number(e.target.value) })}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => downloadTextFile("icon.svg", svgMarkup, "image/svg+xml")}>Export SVG</button>
            <button onClick={onExportPng}>Export PNG</button>
            <button onClick={onSave}>Save to Local Library</button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold">SVG Preview</h2>
          <div className="aspect-square w-full rounded-md border border-slate-200 bg-white p-3" dangerouslySetInnerHTML={{ __html: svgMarkup }} />
        </div>
      </section>
    </div>
  );
}
