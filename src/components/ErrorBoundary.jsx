import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          background: "#0a0a0f",
          color: "#94a3b8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
          padding: 24,
        }}>
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>
              Wystąpił błąd
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20, lineHeight: 1.6 }}>
              Strona napotkała nieoczekiwany problem. Spróbuj odświeżyć stronę.
            </div>
            {this.state.error && (
              <pre style={{
                fontSize: 11,
                color: "#ef4444",
                background: "#1a1a25",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: 16,
                textAlign: "left",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: 200,
                overflow: "auto",
                marginBottom: 20,
              }}>
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => window.location.href = "/"}
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f1f5f9",
                borderRadius: 8,
                padding: "8px 20px",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "inherit",
              }}
            >
              Strona główna
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
