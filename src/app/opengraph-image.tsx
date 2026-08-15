import { ImageResponse } from "next/og"

export const alt = "Alfredo Da Gonza — Full-stack Developer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          color: "#f2f2f2",
          backgroundColor: "#150c0d",
          backgroundImage: "radial-gradient(circle at 15% 10%, #622326 0%, transparent 32%)",
          border: "2px solid #5d3f3d",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "#ffb3ad", fontSize: 28, letterSpacing: 5, textTransform: "uppercase" }}>
          <span style={{ color: "#ff5451" }}>{"<"}</span> Portfolio <span style={{ color: "#ff5451" }}>{"/>"}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -3 }}>Alfredo Da Gonza</div>
          <div style={{ marginTop: 18, color: "#e0b4b6", fontSize: 32 }}>Full-stack developer · Web apps · Automation</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#ffb3ad", fontSize: 24 }}>
          <span>Selected engineering work</span>
          <span style={{ color: "#ff5451" }}>{"{} <> 01"}</span>
        </div>
      </div>
    ),
    size,
  )
}
