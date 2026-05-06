function StatusCard({ current, capacidad }) {
  const ocupacion = current / capacidad;

  const estado =
    ocupacion < 0.5 ? "🟢 Normal" :
    ocupacion < 0.8 ? "🟡 Precaución" :
    "🔴 Riesgo";

  return (
    <div style={card}>
      <h2>Estado del sistema</h2>
      <h1>{estado}</h1>
      <p>Personas: {current}</p>
      <p>Ocupación: {(ocupacion * 100).toFixed(0)}%</p>
    </div>
  );
}

const card = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "10px"
};

export default StatusCard;