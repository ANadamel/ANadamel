"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { renderSvg } from "@/lib/render-svg";
import { readLibrary, SavedIcon, writeLibrary } from "@/lib/storage";

export default function LibraryPage() {
  const [items, setItems] = useState<SavedIcon[]>([]);

  useEffect(() => {
    setItems(readLibrary());
  }, []);

  function remove(id: string) {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    writeLibrary(next);
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Saved Library</h1>
        <Link href="/" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium">Back</Link>
      </header>

      {items.length === 0 ? <p className="text-sm text-slate-600">No saved icons yet.</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
            <div className="aspect-square rounded-md border border-slate-200 p-2" dangerouslySetInnerHTML={{ __html: renderSvg(item.spec) }} />
            <h2 className="font-semibold">{item.name}</h2>
            <p className="text-xs text-slate-500">{item.prompt}</p>
            <button onClick={() => remove(item.id)}>Delete</button>
          </article>
        ))}
      </div>
    </div>
  );
}
