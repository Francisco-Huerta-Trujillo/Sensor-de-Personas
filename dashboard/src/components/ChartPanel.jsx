import React, { useEffect, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid
} from "recharts";

function ChartPanel({ data, capacidad }) {
  const getColor = (ocu) => {
    if (ocu < 0.5) return "#00e5a0";
    if (ocu < 0.8) return "#fbbf24";
    return "#ff6b6b";
  };

  const last = data.length > 0 ? data[data.length - 1].personas : 0;
  const lineColor = getColor(last / capacidad);

  const recent = data.slice(-20);
  const maxVal = recent.length > 0 ? Math.max(...recent.map(d => d.personas)) : 0;
  const minVal = recent.length > 0 ? Math.min(...recent.map(d => d.personas)) : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <div style={styles.tooltipTime}>{label}</div>
          <div style={{ ...styles.tooltipVal, color: lineColor }}>
            {payload[0].value} personas
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={card}>
      <div style={styles.header}>
        <div style={styles.label}>Tendencia — últimas 30 lecturas</div>
        <div style={styles.legend}>
          <span style={{ ...styles.legendDot, background: lineColor }} />
          <span style={styles.legendText}>Personas en tiempo real</span>
        </div>
      </div>

      <div style={styles.miniStats}>
        <div style={styles.miniStat}>
          <span style={styles.miniLabel}>Mín</span>
          <span style={{ ...styles.miniVal, color: "#00e5a0" }}>{minVal}</span>
        </div>
        <div style={styles.miniStat}>
          <span style={styles.miniLabel}>Máx</span>
          <span style={{ ...styles.miniVal, color: "#ff6b6b" }}>{maxVal}</span>
        </div>
        <div style={styles.miniStat}>
          <span style={styles.miniLabel}>Aforo</span>
          <span style={styles.miniVal}>{capacidad}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
            tick={{ fill: "#64748b", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, capacidad]}
            tick={{ fill: "#64748b", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={capacidad * 0.8}
            stroke="#ff6b6b"
            strokeDasharray="4 4"
            strokeOpacity={0.4}
          />
          <Line
            type="monotone"
            dataKey="personas"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={styles.refNote}>
        <span style={styles.refDash} /> Umbral de precaución (80%)
      </div>
    </div>
  );
}

const card = {
  background: "#1e293b",
  padding: "20px 22px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.06)",
};

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  label: {
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#94a3b8",
  },
  legend: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  legendDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    display: "inline-block",
  },
  legendText: {
    fontSize: "11px",
    color: "#64748b",
  },
  miniStats: {
    display: "flex",
    gap: "20px",
    marginBottom: "16px",
  },
  miniStat: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  miniLabel: {
    fontSize: "10px",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  miniVal: {
    fontSize: "16px",
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
    color: "#f1f5f9",
  },
  tooltip: {
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "8px 12px",
  },
  tooltipTime: {
    fontSize: "11px",
    color: "#64748b",
    marginBottom: "2px",
  },
  tooltipVal: {
    fontSize: "14px",
    fontWeight: 600,
  },
  refNote: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    color: "#64748b",
    marginTop: "8px",
  },
  refDash: {
    display: "inline-block",
    width: "18px",
    borderTop: "2px dashed rgba(255,107,107,0.5)",
  },
};

export default ChartPanel;