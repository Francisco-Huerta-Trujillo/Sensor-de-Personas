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
        time: new Date().toLocaleTimeString(),
        personas: json.people_count
      }
    ].slice(-30));
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Análisis de Comportamiento en Espacio</h1>

      <div style={styles.grid}>
        <StatusCard current={current} capacidad={capacidad} />
        <InsightsPanel data={data} capacidad={capacidad} />
        <ChartPanel data={data} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#cfd9f0",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "sans-serif"
  },
  title: {
    marginBottom: "20px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  }
};

export default App;