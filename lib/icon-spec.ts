export type PrimitiveType = "rect" | "circle" | "ellipse" | "line" | "polyline" | "polygon" | "path";
export type IconMode = "outline" | "solid";

export interface PrimitiveBase {
  id: string;
  type: PrimitiveType;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

export interface RectPrimitive extends PrimitiveBase {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
  ry?: number;
}

export interface CirclePrimitive extends PrimitiveBase {
  type: "circle";
  cx: number;
  cy: number;
  r: number;
}

export interface EllipsePrimitive extends PrimitiveBase {
  type: "ellipse";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface LinePrimitive extends PrimitiveBase {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface PolyPrimitive extends PrimitiveBase {
  type: "polyline" | "polygon";
  points: number[];
}

export interface PathPrimitive extends PrimitiveBase {
  type: "path";
  d: string;
}

export type IconPrimitive =
  | RectPrimitive
  | CirclePrimitive
  | EllipsePrimitive
  | LinePrimitive
  | PolyPrimitive
  | PathPrimitive;

export interface IconLayer {
  id: string;
  z: number;
  primitives: IconPrimitive[];
}

export interface IconSpec {
  version: 1;
  mode: IconMode;
  strokeWidth: number;
  cornerRadius: number;
  viewBox: { width: number; height: number };
  background?: string;
  layers: IconLayer[];
}

export interface IconVariationBundle {
  prompt: string;
  variations: IconSpec[];
}

export const iconSpecSchema = {
  type: "object",
  additionalProperties: false,
  required: ["version", "mode", "strokeWidth", "cornerRadius", "viewBox", "layers"],
  properties: {
    version: { type: "integer", enum: [1] },
    mode: { type: "string", enum: ["outline", "solid"] },
    strokeWidth: { type: "number", minimum: 0, maximum: 20 },
    cornerRadius: { type: "number", minimum: 0, maximum: 128 },
    background: { type: "string" },
    viewBox: {
      type: "object",
      additionalProperties: false,
      required: ["width", "height"],
      properties: {
        width: { type: "integer", minimum: 16, maximum: 1024 },
        height: { type: "integer", minimum: 16, maximum: 1024 }
      }
    },
    layers: {
      type: "array",
      minItems: 1,
      maxItems: 12,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "z", "primitives"],
        properties: {
          id: { type: "string" },
          z: { type: "integer", minimum: -100, maximum: 100 },
          primitives: {
            type: "array",
            minItems: 1,
            maxItems: 64,
            items: {
              oneOf: [
                {
                  type: "object",
                  additionalProperties: false,
                  required: ["id", "type", "x", "y", "width", "height"],
                  properties: {
                    id: { type: "string" },
                    type: { const: "rect" },
                    x: { type: "number" },
                    y: { type: "number" },
                    width: { type: "number", minimum: 0 },
                    height: { type: "number", minimum: 0 },
                    rx: { type: "number", minimum: 0 },
                    ry: { type: "number", minimum: 0 },
                    fill: { type: "string" },
                    stroke: { type: "string" },
                    strokeWidth: { type: "number", minimum: 0 },
                    opacity: { type: "number", minimum: 0, maximum: 1 }
                  }
                },
                {
                  type: "object",
                  additionalProperties: false,
                  required: ["id", "type", "cx", "cy", "r"],
                  properties: {
                    id: { type: "string" },
                    type: { const: "circle" },
                    cx: { type: "number" },
                    cy: { type: "number" },
                    r: { type: "number", minimum: 0 },
                    fill: { type: "string" },
                    stroke: { type: "string" },
                    strokeWidth: { type: "number", minimum: 0 },
                    opacity: { type: "number", minimum: 0, maximum: 1 }
                  }
                },
                {
                  type: "object",
                  additionalProperties: false,
                  required: ["id", "type", "cx", "cy", "rx", "ry"],
                  properties: {
                    id: { type: "string" },
                    type: { const: "ellipse" },
                    cx: { type: "number" },
                    cy: { type: "number" },
                    rx: { type: "number", minimum: 0 },
                    ry: { type: "number", minimum: 0 },
                    fill: { type: "string" },
                    stroke: { type: "string" },
                    strokeWidth: { type: "number", minimum: 0 },
                    opacity: { type: "number", minimum: 0, maximum: 1 }
                  }
                },
                {
                  type: "object",
                  additionalProperties: false,
                  required: ["id", "type", "x1", "y1", "x2", "y2"],
                  properties: {
                    id: { type: "string" },
                    type: { const: "line" },
                    x1: { type: "number" },
                    y1: { type: "number" },
                    x2: { type: "number" },
                    y2: { type: "number" },
                    fill: { type: "string" },
                    stroke: { type: "string" },
                    strokeWidth: { type: "number", minimum: 0 },
                    opacity: { type: "number", minimum: 0, maximum: 1 }
                  }
                },
                {
                  type: "object",
                  additionalProperties: false,
                  required: ["id", "type", "points"],
                  properties: {
                    id: { type: "string" },
                    type: { type: "string", enum: ["polyline", "polygon"] },
                    points: { type: "array", minItems: 4, items: { type: "number" } },
                    fill: { type: "string" },
                    stroke: { type: "string" },
                    strokeWidth: { type: "number", minimum: 0 },
                    opacity: { type: "number", minimum: 0, maximum: 1 }
                  }
                },
                {
                  type: "object",
                  additionalProperties: false,
                  required: ["id", "type", "d"],
                  properties: {
                    id: { type: "string" },
                    type: { const: "path" },
                    d: { type: "string" },
                    fill: { type: "string" },
                    stroke: { type: "string" },
                    strokeWidth: { type: "number", minimum: 0 },
                    opacity: { type: "number", minimum: 0, maximum: 1 }
                  }
                }
              ]
            }
          }
        }
      }
    }
  }
} as const;

export const iconVariationSchema = {
  type: "object",
  additionalProperties: false,
  required: ["prompt", "variations"],
  properties: {
    prompt: { type: "string" },
    variations: {
      type: "array",
      minItems: 6,
      maxItems: 6,
      items: iconSpecSchema
    }
  }
} as const;
