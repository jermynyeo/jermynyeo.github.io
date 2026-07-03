import { ImageResponse } from "next/og"
import { site } from "@/content/site"

export const dynamic = "force-static"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = site.title

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0f0d",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 900,
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
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "44px 56px 56px",
            }}
          >
            <div style={{ display: "flex", fontSize: 34, color: "#94a3b8" }}>
              <span style={{ color: "#4ade80", marginRight: 16 }}>$</span>
              whoami
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 84,
                fontWeight: 700,
                color: "#ffffff",
                marginTop: 20,
                letterSpacing: 2,
              }}
            >
              {site.name}
            </div>
            <div style={{ display: "flex", fontSize: 40, color: "#4ade80", marginTop: 12 }}>
              {site.role}
            </div>
            <div style={{ display: "flex", fontSize: 28, color: "#94a3b8", marginTop: 28 }}>
              {site.url.replace("https://", "")}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
