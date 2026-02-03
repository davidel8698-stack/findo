import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Findo - אוטומציה לעסקים קטנים";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Dynamic Open Graph image generation
 * - Orange gradient background matching brand colors
 * - Findo logo text centered
 * - Hebrew tagline with RTL direction
 * - 1200x630 standard OG size
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: "bold",
            color: "white",
            marginBottom: 20,
          }}
        >
          Findo
        </div>
        <div
          style={{
            fontSize: 48,
            color: "white",
            textAlign: "center",
            direction: "rtl",
          }}
        >
          יותר לקוחות. פחות עבודה.
        </div>
      </div>
    ),
    { ...size }
  );
}
