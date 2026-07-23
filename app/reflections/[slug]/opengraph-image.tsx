import { ImageResponse } from "next/og"
import { site } from "@/content/site"
import { getReflection, getReflections } from "@/lib/reflections"

export const dynamic = "force-static"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/** One card per reflection — required for the static export (`output: "export"`). */
export function generateStaticParams() {
  return getReflections().map((item) => ({ slug: item.slug }))
}

export const alt = "Reflection by Jermyn Yeo"

export default async function ReflectionOgImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getReflection(slug)

  const question = item?.question ?? "How can we tell if data is trustworthy?"
  const kind = item?.kind ?? "Thoughts"
  const tags = (item?.tags ?? []).slice(0, 4)

  // Scale the headline down as the question grows so it never overflows.
  // Long questions wrap to 3 lines, so they need the biggest step down.
  const qSize = question.length > 96 ? 44 : question.length > 70 ? 50 : 68

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 40,
          background: "#0a0f0d",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            borderRadius: 16,
            border: "2px solid rgba(74, 222, 128, 0.35)",
            background: "#0d1411",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "20px 28px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ width: 18, height: 18, borderRadius: 9, background: "rgba(255,95,86,0.55)" }} />
            <div style={{ width: 18, height: 18, borderRadius: 9, background: "rgba(255,189,46,0.55)" }} />
            <div style={{ width: 18, height: 18, borderRadius: 9, background: "rgba(74,222,128,0.55)" }} />
            <div style={{ display: "flex", marginLeft: 18, fontSize: 24, color: "#64748b" }}>
              ~/reflections/{slug}.md
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "space-between",
              padding: "40px 52px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 30, color: "#94a3b8" }}>
                <span style={{ color: "#4ade80", marginRight: 16 }}>$</span>
                cat {slug}.md
              </div>
              <div style={{ display: "flex", fontSize: 26, color: "#4ade80", marginTop: 28 }}>
                {kind}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: qSize,
                  fontWeight: 700,
                  color: "#ffffff",
                  marginTop: 14,
                  lineHeight: 1.15,
                  letterSpacing: 0.5,
                }}
              >
                {question}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {tags.map((t) => (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      fontSize: 22,
                      color: "#94a3b8",
                      padding: "6px 16px",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 24,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ display: "flex", fontSize: 28, color: "#ffffff", letterSpacing: 1 }}>
                  {site.name}
                </div>
                <div style={{ display: "flex", fontSize: 24, color: "#64748b" }}>
                  {site.url.replace("https://", "")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
