import React, { useEffect, useState } from "react";
import StatusCard from "./components/StatusCard";
import InsightsPanel from "./components/InsightsPanel";
import ChartPanel from "./components/ChartPanel";

const CAPACIDAD = 20;

// 🔌 Cambia la IP y puerto por donde corre tu FastAPI
const API_URL = "http://192.168.1.115:8000";

export default function App() {
  const [data, setData]       = useState([]);
  const [current, setCurrent] = useState(0);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const tick = async () => {
      try {
        const res = await fetch(`${API_URL}/ultimo`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();

        // Campos que devuelve tu FastAPI
        const count = json.people_count_all ?? 0;
        const time  = new Date(json.timestamp).toLocaleTimeString("es-MX", {
          hour: "2-digit", minute: "2-digit", second: "2-digit"
        });

        setCurrent(count);
        setData(prev => [...prev, { time, personas: count }].slice(-30));
        setError(null);

      } catch (err) {
        setError(err.message);
      }
    };

    tick();
    const id = setInterval(tick, 4000);
    return () => clearInterval(id);
  }, []);

  const prevVal = data.length > 1 ? data[data.length - 2].personas : null;
  const delta   = prevVal !== null ? current - prevVal : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; width: 100%; }
        body { background: #f0f4f8; overflow: hidden; }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(.8); }
        }
      `}</style>

      <div style={{
        display: "grid",
        gridTemplateRows: "48px 1fr 1fr",
        height: "100vh",
        width: "100vw",
        background: "#f0f4f8",
        color: "#0f172a",
        fontFamily: "'DM Sans', sans-serif",
        padding: "16px 20px",
        gap: 14,
      }}>

        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "#0f172a" }}>
            Análisis de Espacio
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

            {error && (
              <div style={{
                fontSize: 12, color: "#dc2626",
                background: "#fee2e2", border: "1px solid #fecaca",
                padding: "4px 12px", borderRadius: 99,
              }}>
                ⚠️ Sin conexión: {error}
              </div>
            )}

            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 500, color: "#059669",
              background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.25)",
              padding: "4px 14px", borderRadius: 99,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#059669", animation: "pulse 1.4s ease-in-out infinite" }} />
              En vivo · cada 4s
            </div>
          </div>
        </div>

        {/* FILA SUPERIOR */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, minHeight: 0 }}>
          <StatusCard current={current} capacidad={CAPACIDAD} delta={delta} prevVal={prevVal} />
          <InsightsPanel data={data} capacidad={CAPACIDAD} />
        </div>

        {/* FILA INFERIOR */}
        <ChartPanel data={data} capacidad={CAPACIDAD} current={current} />

      </div>
    </>
  );
}