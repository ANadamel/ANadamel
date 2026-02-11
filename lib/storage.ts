import { IconSpec } from "@/lib/icon-spec";

export interface SavedIcon {
  id: string;
  name: string;
  prompt: string;
  spec: IconSpec;
  createdAt: string;
}

const KEY = "icon-library-v1";

export function readLibrary(): SavedIcon[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as SavedIcon[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeLibrary(items: SavedIcon[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function saveIcon(icon: Omit<SavedIcon, "id" | "createdAt">): SavedIcon {
  const record: SavedIcon = {
    ...icon,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
  const existing = readLibrary();
  writeLibrary([record, ...existing]);
  return record;
}
