import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { iconVariationSchema, type IconVariationBundle } from "@/lib/icon-spec";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { prompt } = (await request.json()) as { prompt?: string };
    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const response = await openai.responses.create({
      model: process.env.OPENAI_ICON_MODEL ?? "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You generate icon specs as strict JSON only. Always return exactly 6 distinct variations with clean geometry and valid coordinates inside the viewBox."
        },
        {
          role: "user",
          content: `Create six icon variations for: ${prompt}.`
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "icon_variations",
          schema: iconVariationSchema,
          strict: true
        }
      }
    });

    const payload = response.output_text;
    const parsed = JSON.parse(payload) as IconVariationBundle;

    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown generation error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
