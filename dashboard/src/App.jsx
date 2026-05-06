import React, { useEffect, useState, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid
} from "recharts";

const CAPACIDAD = 20;

function siguienteCuenta(prev) {
  const delta = Math.round((Math.random() - 0.46) * 3);
  return Math.max(0, Math.min(CAPACIDAD, prev + delta));
}

function getColor(ocu) {
  if (ocu < 0.5) return "#00e5a0";
  if (ocu < 0.8) return "#fbbf24";
  return "#ff6b6b";
}

function getEstado(ocu) {
  if (ocu < 0.5) return { text: "🟢 Normal",     bg: "rgba(0,229,160,0.08)",   border: "rgba(0,229,160,0.3)" };
  if (ocu < 0.8) return { text: "🟡 Precaución", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.3)" };
  return           { text: "🔴 Riesgo alto",  bg: "rgba(255,107,107,0.08)", border: "rgba(255,107,107,0.3)" };
}

function getInsights(data, cap) {
  if (data.length < 5)
    return [{ icon: "⏳", color: "rgba(148,163,184,0.1)", text: "Recolectando datos iniciales..." }];
  const last  = data[data.length - 1].personas;
  const prev5 = data[data.length - 5].personas;
  const delta = last - prev5;
  const avg   = data.reduce((a, b) => a + b.personas, 0) / data.length;
  const out   = [];
  if (delta > 4)        out.push({ icon: "📈", color: "rgba(255,107,107,0.15)",  text: "Aumento rápido — posible acumulación" });
  if (delta < -4)       out.push({ icon: "📉", color: "rgba(0,229,160,0.12)",    text: "Flujo de salida notable" });
  if (last > avg * 1.5) out.push({ icon: "⚠️", color: "rgba(251,191,36,0.15)",  text: "Comportamiento anómalo — muy por encima del promedio" });
  if (last > cap * 0.8) out.push({ icon: "🚨", color: "rgba(255,107,107,0.15)", text: "Zona de saturación — aforo casi al límite" });
  if (out.length === 0) out.push({ icon: "✅", color: "rgba(0,229,160,0.12)",    text: "Todo normal — sin anomalías detectadas" });
  return out;
}

function CustomTooltip({ active, payload, label, color }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px" }}>
      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color }}>{payload[0].value} personas</div>
    </div>
  );
}

export default function App() {
  const [data, setData]       = useState([]);
  const [current, setCurrent] = useState(5);
  const currentRef            = useRef(5);

  useEffect(() => {
    const tick = () => {
      const next = siguienteCuenta(currentRef.current);
      currentRef.current = next;
      const time = new Date().toLocaleTimeString("es-MX", {
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      });
      setCurrent(next);
      setData(prev => [...prev, { time, personas: next }].slice(-30));
    };
    tick();
    const id = setInterval(tick, 4000);
    return () => clearInterval(id);
  }, []);

  const ocu      = current / CAPACIDAD;
  const color    = getColor(ocu);
  const estado   = getEstado(ocu);
  const insights = getInsights(data, CAPACIDAD);
  const prevVal  = data.length > 1 ? data[data.length - 2].personas : null;
  const delta    = prevVal !== null ? current - prevVal : 0;
  const recent   = data.slice(-20);
  const maxVal   = recent.length ? Math.max(...recent.map(d => d.personas)) : 0;
  const minVal   = recent.length ? Math.min(...recent.map(d => d.personas)) : 0;

  const card = {
    background: "#1e293b",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "18px 20px",
    boxSizing: "border-box",
    minWidth: 0,
  };

  const label = {
    fontSize: 10, fontWeight: 500,
    letterSpacing: "0.09em", textTransform: "uppercase",
    color: "#64748b", marginBottom: 10,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; width: 100%; }
        body { background: #0a1628; overflow: hidden; }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(.8); }
        }
      `}</style>

      <div style={{
        display: "grid",
        gridTemplateRows: "48px 1fr 1fr",
        gridTemplateColumns: "1fr",
        height: "100vh",
        width: "100vw",
        background: "#0a1628",
        color: "#f1f5f9",
        fontFamily: "'DM Sans', sans-serif",
        padding: "16px 20px",
        gap: 14,
      }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "#f1f5f9" }}>
            Análisis de Espacio
          </h1>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 500, color: "#00e5a0",
            background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.25)",
            padding: "4px 14px", borderRadius: 99,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00e5a0", animation: "pulse 1.4s ease-in-out infinite" }} />
            En vivo · cada 4s
          </div>
        </div>

        {/* ── FILA SUPERIOR: 4 cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, minHeight: 0 }}>

          {/* 1 · Personas ahora */}
          <div style={{ ...card, borderTop: `3px solid ${color}` }}>
            <div style={label}>Personas ahora</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 800, lineHeight: 1, color }}>
              {current}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
              {prevVal === null ? "—" :
                delta > 0 ? <span style={{ color: "#ff6b6b" }}>▲ +{delta} vs anterior</span> :
                delta < 0 ? <span style={{ color: "#00e5a0" }}>▼ {delta} vs anterior</span> :
                <span>Sin cambio</span>}
            </div>
          </div>

          {/* 2 · Ocupación */}
          <div style={{ ...card, borderTop: `3px solid ${color}` }}>
            <div style={label}>Ocupación</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 800, lineHeight: 1, color }}>
              {Math.round(ocu * 100)}%
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden", marginTop: 14 }}>
              <div style={{ height: "100%", borderRadius: 99, background: color, width: `${Math.round(ocu * 100)}%`, transition: "width .6s cubic-bezier(.4,0,.2,1), background .4s" }} />
            </div>
          </div>

          {/* 3 · Estado */}
          <div style={{ ...card, borderTop: `3px solid ${color}`, background: estado.bg, borderColor: estado.border }}>
            <div style={label}>Estado</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 12 }}>
              {estado.text}
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              {[["Personas", current], ["Capacidad", CAPACIDAD]].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: "#f1f5f9" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 4 · Insights */}
          <div style={{ ...card, borderTop: "3px solid #7c3aed", overflowY: "auto" }}>
            <div style={label}>Insights</div>
            {insights.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "8px 0",
                borderBottom: i < insights.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, background: item.color }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: 12, color: "#f1f5f9", lineHeight: 1.5, paddingTop: 3 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FILA INFERIOR: historial + tendencia ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, minHeight: 0 }}>

          {/* 5 · Historial reciente */}
          <div style={{ ...card, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={label}>Historial reciente</div>
              <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#64748b" }}>
                <span>Mín <strong style={{ color: "#00e5a0", fontFamily: "'Syne', sans-serif" }}>{minVal}</strong></span>
                <span>Máx <strong style={{ color: "#ff6b6b", fontFamily: "'Syne', sans-serif" }}>{maxVal}</strong></span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, flex: 1 }}>
              {recent.map((d, i) => (
                <div key={i} style={{
                  flex: 1,
                  height: `${Math.max(4, Math.round((d.personas / CAPACIDAD) * 100))}%`,
                  borderRadius: "3px 3px 0 0",
                  background: getColor(d.personas / CAPACIDAD),
                  opacity: 0.78,
                  transition: "height .4s ease",
                }} />
              ))}
            </div>
          </div>

          {/* 6 · Tendencia */}
          <div style={{ ...card, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={label}>Tendencia — últimas 30 lecturas</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                Personas en tiempo real
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="time" tick={{ fill: "#475569", fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis domain={[0, CAPACIDAD]} tick={{ fill: "#475569", fontSize: 9 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip color={color} />} />
                  <ReferenceLine y={CAPACIDAD * 0.8} stroke="#ff6b6b" strokeDasharray="4 4" strokeOpacity={0.4} />
                  <Line type="monotone" dataKey="personas" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b", marginTop: 6 }}>
              <span style={{ display: "inline-block", width: 18, borderTop: "2px dashed rgba(255,107,107,0.5)" }} />
              Umbral de precaución (80%)
            </div>
          </div>

        </div>
      </div>
    </>
  );
}