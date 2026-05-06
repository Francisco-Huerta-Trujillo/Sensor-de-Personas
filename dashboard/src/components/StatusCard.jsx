import React from "react";

function getColor(ocu) {
  if (ocu < 0.5) return "#059669";
  if (ocu < 0.8) return "#d97706";
  return "#dc2626";
}

function getEstado(ocu) {
  if (ocu < 0.5) return { text: "🟢 Normal",     bg: "#f0fdf4", border: "#bbf7d0" };
  if (ocu < 0.8) return { text: "🟡 Precaución", bg: "#fffbeb", border: "#fde68a" };
  return           { text: "🔴 Riesgo alto",  bg: "#fef2f2", border: "#fecaca" };
}

const cardBase = {
  background: "#ffffff",
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  padding: "18px 20px",
  boxSizing: "border-box",
  minWidth: 0,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const labelStyle = {
  fontSize: 10, fontWeight: 600,
  letterSpacing: "0.09em", textTransform: "uppercase",
  color: "#94a3b8", marginBottom: 10,
};

export default function StatusCard({ current, capacidad, delta, prevVal }) {
  const ocu    = current / capacidad;
  const color  = getColor(ocu);
  const estado = getEstado(ocu);

  const DeltaLabel = () => {
    if (prevVal === null) return <span>—</span>;
    if (delta > 0) return <span style={{ color: "#dc2626" }}>▲ +{delta} vs anterior</span>;
    if (delta < 0) return <span style={{ color: "#059669" }}>▼ {delta} vs anterior</span>;
    return <span style={{ color: "#94a3b8" }}>Sin cambio</span>;
  };

  return (
    <>
      {/* Card 1: Personas ahora */}
      <div style={{ ...cardBase, borderTop: `3px solid ${color}` }}>
        <div style={labelStyle}>Personas ahora</div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 48, fontWeight: 800, lineHeight: 1, color }}>
          {current}
        </div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>
          <DeltaLabel />
        </div>
      </div>

      {/* Card 2: Ocupación */}
      <div style={{ ...cardBase, borderTop: `3px solid ${color}` }}>
        <div style={labelStyle}>Ocupación</div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 48, fontWeight: 800, lineHeight: 1, color }}>
          {Math.round(ocu * 100)}%
        </div>
        <div style={{ height: 5, background: "#e2e8f0", borderRadius: 99, overflow: "hidden", marginTop: 14 }}>
          <div style={{
            height: "100%", borderRadius: 99, background: color,
            width: `${Math.round(ocu * 100)}%`,
            transition: "width .6s cubic-bezier(.4,0,.2,1), background .4s"
          }} />
        </div>
      </div>

      {/* Card 3: Estado */}
      <div style={{ ...cardBase, borderTop: `3px solid ${color}`, background: estado.bg, borderColor: estado.border }}>
        <div style={labelStyle}>Estado</div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
          {estado.text}
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[["Personas", current], ["Capacidad", capacidad]].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: "#0f172a" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}