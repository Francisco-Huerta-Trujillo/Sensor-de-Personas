import React from "react";

function InsightsPanel({ data, capacidad }) {
  const getInsights = () => {
    if (data.length < 5) {
      return [{ icon: "⏳", color: "rgba(148,163,184,0.1)", text: "Recolectando datos iniciales..." }];
    }

    const last = data[data.length - 1].personas;
    const prev = data[data.length - 5].personas;
    const delta = last - prev;
    const avg = data.reduce((a, b) => a + b.personas, 0) / data.length;

    let insights = [];

    if (delta > 5)
      insights.push({ icon: "📈", color: "rgba(255,107,107,0.15)", text: "Aumento rápido detectado — posible acumulación" });
    if (delta < -5)
      insights.push({ icon: "📉", color: "rgba(0,229,160,0.12)", text: "Flujo de salida notable en los últimos segmentos" });
    if (last > avg * 1.5)
      insights.push({ icon: "⚠️", color: "rgba(251,191,36,0.15)", text: "Comportamiento anómalo — muy por encima del promedio" });
    if (last > capacidad * 0.8)
      insights.push({ icon: "🚨", color: "rgba(255,107,107,0.15)", text: "Zona de saturación — aforo casi al límite" });
    if (insights.length === 0)
      insights.push({ icon: "✅", color: "rgba(0,229,160,0.12)", text: "Todo normal — sin anomalías detectadas" });

    return insights;
  };

  const insights = getInsights();

  return (
    <div style={card}>
      <div style={styles.label}>Insights</div>
      {insights.map((item, idx) => (
        <div key={idx} style={styles.item}>
          <div style={{ ...styles.iconBox, background: item.color }}>
            {item.icon}
          </div>
          <span style={styles.text}>{item.text}</span>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "#1e293b",
  padding: "20px 22px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.06)",
};

const styles = {
  label: {
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#94a3b8",
    marginBottom: "14px",
  },
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  iconBox: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    flexShrink: 0,
  },
  text: {
    fontSize: "13px",
    color: "#f1f5f9",
    lineHeight: 1.5,
    marginTop: "4px",
  },
};

export default InsightsPanel;