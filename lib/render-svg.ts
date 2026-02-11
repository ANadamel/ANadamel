import { IconPrimitive, IconSpec } from "@/lib/icon-spec";

const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const attrs = (pairs: Record<string, string | number | undefined>) =>
  Object.entries(pairs)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}="${escape(String(value))}"`)
    .join(" ");

const pointsToString = (points: number[]) => {
  const pairs: string[] = [];
  for (let i = 0; i < points.length - 1; i += 2) {
    pairs.push(`${points[i]},${points[i + 1]}`);
  }
  return pairs.join(" ");
};

function renderPrimitive(primitive: IconPrimitive, defaults: Pick<IconSpec, "mode" | "strokeWidth" | "cornerRadius">): string {
  const stroke = primitive.stroke ?? (defaults.mode === "outline" ? "#111827" : "none");
  const fill = primitive.fill ?? (defaults.mode === "solid" ? "#111827" : "none");
  const strokeWidth = primitive.strokeWidth ?? defaults.strokeWidth;
  const common = {
    fill,
    stroke,
    "stroke-width": strokeWidth,
    opacity: primitive.opacity
  };

  switch (primitive.type) {
    case "rect":
      return `<rect ${attrs({ ...common, x: primitive.x, y: primitive.y, width: primitive.width, height: primitive.height, rx: primitive.rx ?? defaults.cornerRadius, ry: primitive.ry ?? defaults.cornerRadius })} />`;
    case "circle":
      return `<circle ${attrs({ ...common, cx: primitive.cx, cy: primitive.cy, r: primitive.r })} />`;
    case "ellipse":
      return `<ellipse ${attrs({ ...common, cx: primitive.cx, cy: primitive.cy, rx: primitive.rx, ry: primitive.ry })} />`;
    case "line":
      return `<line ${attrs({ ...common, fill: "none", x1: primitive.x1, y1: primitive.y1, x2: primitive.x2, y2: primitive.y2 })} />`;
    case "polyline":
      return `<polyline ${attrs({ ...common, fill: "none", points: pointsToString(primitive.points) })} />`;
    case "polygon":
      return `<polygon ${attrs({ ...common, points: pointsToString(primitive.points) })} />`;
    case "path":
      return `<path ${attrs({ ...common, d: primitive.d })} />`;
    default: {
      const exhaustiveCheck: never = primitive;
      return exhaustiveCheck;
    }
  }
}

export function renderSvg(spec: IconSpec): string {
  const width = spec.viewBox.width;
  const height = spec.viewBox.height;
  const layers = [...spec.layers].sort((a, b) => a.z - b.z || a.id.localeCompare(b.id));

  const body = layers
    .map((layer) => {
      const primitives = [...layer.primitives].sort((a, b) => a.id.localeCompare(b.id));
      const content = primitives.map((p) => renderPrimitive(p, spec)).join("");
      return `<g id="${escape(layer.id)}" data-z="${layer.z}">${content}</g>`;
    })
    .join("");

  const bg = spec.background
    ? `<rect x="0" y="0" width="${width}" height="${height}" fill="${escape(spec.background)}" />`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${bg}${body}</svg>`;
}
