import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid
} from "recharts";

function getColor(ocu) {
  if (ocu < 0.5) return "#059669";
  if (ocu < 0.8) return "#d97706";
  return "#dc2626";
}

function CustomTooltip({ active, payload, label, color }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color }}>{payload[0].value} personas</div>
    </div>
  );
}

const cardBase = {
  background: "#ffffff",
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  padding: "18px 20px",
  boxSizing: "border-box",
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const labelStyle = {
  fontSize: 10, fontWeight: 600,
  letterSpacing: "0.09em", textTransform: "uppercase",
  color: "#94a3b8", marginBottom: 10,
};

export default function ChartPanel({ data, capacidad, current }) {
  const ocu    = current / capacidad;
  const color  = getColor(ocu);
  const recent = data.slice(-20);
  const maxVal = recent.length ? Math.max(...recent.map(d => d.personas)) : 0;
  const minVal = recent.length ? Math.min(...recent.map(d => d.personas)) : 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, minHeight: 0 }}>

      {/* Card 5: Historial reciente */}
      <div style={cardBase}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={labelStyle}>Historial reciente</div>
          <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#94a3b8" }}>
            <span>Mín <strong style={{ color: "#059669", fontFamily: "'Outfit', sans-serif" }}>{minVal}</strong></span>
            <span>Máx <strong style={{ color: "#dc2626", fontFamily: "'Outfit', sans-serif" }}>{maxVal}</strong></span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, flex: 1 }}>
          {recent.map((d, i) => (
            <div key={i} style={{
              flex: 1,
              height: `${Math.max(4, Math.round((d.personas / capacidad) * 100))}%`,
              borderRadius: "3px 3px 0 0",
              background: getColor(d.personas / capacidad),
              opacity: 0.7,
              transition: "height .4s ease",
            }} />
          ))}
        </div>
      </div>

      {/* Card 6: Tendencia */}
      <div style={cardBase}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={labelStyle}>Tendencia — últimas 30 lecturas</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
            Personas en tiempo real
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fill: "#cbd5e1", fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis domain={[0, capacidad]} tick={{ fill: "#cbd5e1", fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip color={color} />} />
              <ReferenceLine y={capacidad * 0.8} stroke="#dc2626" strokeDasharray="4 4" strokeOpacity={0.35} />
              <Line type="monotone" dataKey="personas" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
          <span style={{ display: "inline-block", width: 18, borderTop: "2px dashed rgba(220,38,38,0.4)" }} />
          Umbral de precaución (80%)
        </div>
      </div>

    </div>
  );
}