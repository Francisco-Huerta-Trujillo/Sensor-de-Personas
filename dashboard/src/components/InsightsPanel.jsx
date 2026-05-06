import React from "react";

function getInsights(data, cap) {
  if (data.length < 5)
    return [{ icon: "⏳", color: "#f1f5f9", text: "Recolectando datos iniciales..." }];

  const last  = data[data.length - 1].personas;
  const prev5 = data[data.length - 5].personas;
  const delta = last - prev5;
  const avg   = data.reduce((a, b) => a + b.personas, 0) / data.length;
  const out   = [];

  if (delta > 4)        out.push({ icon: "📈", color: "#fee2e2", text: "Aumento rápido — posible acumulación" });
  if (delta < -4)       out.push({ icon: "📉", color: "#dcfce7", text: "Flujo de salida notable" });
  if (last > avg * 1.5) out.push({ icon: "⚠️", color: "#fef9c3", text: "Comportamiento anómalo — muy por encima del promedio" });
  if (last > cap * 0.8) out.push({ icon: "🚨", color: "#fee2e2", text: "Zona de saturación — aforo casi al límite" });
  if (out.length === 0) out.push({ icon: "✅", color: "#dcfce7", text: "Todo normal — sin anomalías detectadas" });

  return out;
}

const cardBase = {
  background: "#ffffff",
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  padding: "18px 20px",
  boxSizing: "border-box",
  minWidth: 0,
  overflowY: "auto",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const labelStyle = {
  fontSize: 10, fontWeight: 600,
  letterSpacing: "0.09em", textTransform: "uppercase",
  color: "#94a3b8", marginBottom: 10,
};

export default function InsightsPanel({ data, capacidad }) {
  const insights = getInsights(data, capacidad);

  return (
    <div style={{ ...cardBase, borderTop: "3px solid #7c3aed" }}>
      <div style={labelStyle}>Insights</div>
      {insights.map((item, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "flex-start", gap: 10,
          padding: "8px 0",
          borderBottom: i < insights.length - 1 ? "1px solid #f1f5f9" : "none",
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, background: item.color,
          }}>
            {item.icon}
          </div>
          <span style={{ fontSize: 12, color: "#334155", lineHeight: 1.5, paddingTop: 3 }}>
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
}