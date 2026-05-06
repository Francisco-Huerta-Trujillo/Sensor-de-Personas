import React, { useEffect, useState } from "react";
import StatusCard from "./components/StatusCard";
import InsightsPanel from "./components/InsightsPanel";
import ChartPanel from "./components/ChartPanel";

function App() {
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState(0);

  const capacidad = 20;

  const fetchData = async () => {
    // 🔌 CAMBIA ESTO POR TU API
    const json = {
      timestamp: new Date().toISOString(),
      people_count: Math.floor(Math.random() * 20)
    };

    setCurrent(json.people_count);

    setData(prev => [
      ...prev,
      {
        time: new Date().toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }),
        personas: json.people_count
      }
    ].slice(-30));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Análisis de Espacio</h1>
        <div style={styles.liveBadge}>
          <div style={styles.liveDot} />
          En vivo · cada 2s
        </div>
      </div>

      <div style={styles.topGrid}>
        <StatusCard current={current} capacidad={capacidad} />
        <InsightsPanel data={data} capacidad={capacidad} />
      </div>

      <ChartPanel data={data} capacidad={capacidad} />
    </div>
  );
}

const styles = {
  container: {
    background: "#0a1628",
    color: "#f1f5f9",
    minHeight: "100vh",
    padding: "28px",
    fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "22px",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    color: "#f1f5f9",
    margin: 0,
  },
  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#00e5a0",
    background: "rgba(0,229,160,0.1)",
    border: "1px solid rgba(0,229,160,0.25)",
    padding: "4px 14px",
    borderRadius: "99px",
  },
  liveDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#00e5a0",
    animation: "pulse 1.4s ease-in-out infinite",
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "14px",
  },
};

export default App;