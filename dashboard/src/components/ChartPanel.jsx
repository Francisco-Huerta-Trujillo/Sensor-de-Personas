import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

function ChartPanel({ data }) {
  return (
    <div style={card}>
      <h2>Historial de ocupación</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="personas" stroke="#38bdf8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const card = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "10px",
  gridColumn: "span 2"
};

export default ChartPanel;