function InsightsPanel({ data, capacidad }) {

  const getInsights = () => {
    if (data.length < 5) return ["Recolectando datos..."];

    const last = data[data.length - 1].personas;
    const prev = data[data.length - 5].personas;
    const delta = last - prev;

    const avg = data.reduce((a, b) => a + b.personas, 0) / data.length;

    let insights = [];

    if (delta > 5) insights.push(" Aumento rápido (posible acumulación)");
    if (delta < -5) insights.push(" Disminución rápida (flujo de salida)");

    if (last > avg * 1.5)
      insights.push("Comportamiento anómalo detectado");

    if (last > capacidad * 0.8)
      insights.push("Zona cerca de saturación");

    if (insights.length === 0)
      insights.push("Comportamiento normal");

    return insights;
  };

  return (
    <div style={card}>
      <h2>Insights de IA</h2>
      {getInsights().map((i, idx) => (
        <p key={idx}>{i}</p>
      ))}
    </div>
  );
}

const card = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "10px"
};

export default InsightsPanel;