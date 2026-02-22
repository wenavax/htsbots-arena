"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ background: "#0A0A0F", color: "#ccc", textAlign: "center", padding: "100px 20px" }}>
        <h1 style={{ fontSize: "48px", color: "#39FF14", fontFamily: "monospace" }}>Error</h1>
        <p style={{ fontFamily: "monospace", marginTop: "20px" }}>Something went wrong</p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "transparent",
            border: "2px solid #39FF14",
            color: "#39FF14",
            fontFamily: "monospace",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
