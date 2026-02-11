import { IconSpec } from "@/lib/icon-spec";

export const defaultSpec: IconSpec = {
  version: 1,
  mode: "outline",
  strokeWidth: 2,
  cornerRadius: 6,
  viewBox: { width: 256, height: 256 },
  background: "#ffffff",
  layers: [
    {
      id: "base",
      z: 0,
      primitives: [
        { id: "shape", type: "rect", x: 36, y: 36, width: 184, height: 184, rx: 48 }
      ]
    }
  ]
};
