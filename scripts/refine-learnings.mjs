// Refines raw learning notes into authentic reflections using the Claude API.
// Reads learnings/drafts/*.md, writes learnings/reflections.json.
// Each draft may opt out of LLM refinement with `refine: false` in its frontmatter.
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

// Default model. Swap to "claude-haiku-4-5" to cut cost for this short task.
const MODEL = "claude-opus-4-8";
const DRAFTS_DIR = "learnings/drafts";
const OUT_FILE = "learnings/reflections.json";

function parseFrontmatter(raw) {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw.trim() };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: m[2].trim() };
}

async function refine(client, topic, kind, body) {
  const system =
    "You are a careful editor for a software engineer's personal portfolio. " +
    "Turn rough first-person notes into a short, authentic reflection (感想) for a 'Learnings' section. " +
    "Keep the writer's own voice and humility. First person. 2-4 sentences. Concrete and specific. " +
    "No cliches, no corporate filler, no hype, no emojis, no hashtags. Do not invent facts beyond the notes. " +
    "Output ONLY the final reflection text — no preamble, no quotes, no markdown, no labels.";
  const user = `Topic: ${topic}\nType: ${kind}\n\nMy rough notes:\n${body}\n\nWrite the refined reflection.`;
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 1000,
    thinking: { type: "adaptive" },
    output_config: { effort: "low" },
    system,
    messages: [{ role: "user", content: user }],
  });
  return res.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
}

async function main() {
  if (!existsSync(DRAFTS_DIR)) {
    writeFileSync(OUT_FILE, "[]\n");
    return;
  }
  const files = readdirSync(DRAFTS_DIR)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md" && !f.startsWith("_"))
    .sort();

  let client = null;
  const reflections = [];
  for (const f of files) {
    const { meta, body } = parseFrontmatter(readFileSync(join(DRAFTS_DIR, f), "utf8"));
    if (!body) continue;
    const topic = meta.topic || f.replace(/\.md$/, "");
    const kind = meta.kind || "";
    const wantRefine = String(meta.refine ?? "true").toLowerCase() !== "false";

    let text;
    if (wantRefine) {
      console.log(`Refining (LLM): ${f}`);
      client = client || new Anthropic(); // reads ANTHROPIC_API_KEY
      text = await refine(client, topic, kind, body);
    } else {
      console.log(`Publishing as-is:  ${f}`);
      text = body;
    }
    reflections.push({ topic, kind, text, source: f });
  }

  writeFileSync(OUT_FILE, JSON.stringify(reflections, null, 2) + "\n");
  console.log(`Wrote ${reflections.length} reflection(s) to ${OUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
