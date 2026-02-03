import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Dynamic favicon generation
 * - Orange background matching brand color
 * - White "F" lettermark
 * - 32x32 standard favicon size
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "#f97316",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          borderRadius: 4,
        }}
      >
        F
      </div>
    ),
    { ...size }
  );
}
