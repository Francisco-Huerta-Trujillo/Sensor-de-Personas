import React from "react";

function StatusCard({ current, capacidad }) {
  const ocupacion = current / capacidad;

  const getColor = (ocu) => {
    if (ocu < 0.5) return "#00e5a0";
    if (ocu < 0.8) return "#fbbf24";
    return "#ff6b6b";
  };

  const getEstado = (ocu) => {
    if (ocu < 0.5) return {
      text: "🟢 Normal",
      bg: "rgba(0,229,160,0.08)",
      border: "rgba(0,229,160,0.25)",
    };
    if (ocu < 0.8) return {
      text: "🟡 Precaución",
      bg: "rgba(251,191,36,0.08)",
      border: "rgba(251,191,36,0.25)",
    };
    return {
      text: "🔴 Riesgo alto",
      bg: "rgba(255,107,107,0.08)",
      border: "rgba(255,107,107,0.25)",
    };
  };

  const color = getColor(ocupacion);
  const estado = getEstado(ocupacion);
  const pct = Math.round(ocupacion * 100);

  return (
    <div style={{ ...card, borderColor: estado.border, background: estado.bg, borderTopColor: color }}>
      <div style={styles.label}>Estado del sistema</div>

      <div style={{ ...styles.estadoText }}>{estado.text}</div>

      <div style={styles.row}>
        <div style={styles.metaBlock}>
          <span style={styles.metaLabel}>Personas</span>
          <span style={{ ...styles.metaValue, color }}>{current}</span>
        </div>
        <div style={styles.metaBlock}>
          <span style={styles.metaLabel}>Capacidad</span>
          <span style={styles.metaValue}>{capacidad}</span>
        </div>
        <div style={styles.metaBlock}>
          <span style={styles.metaLabel}>Ocupación</span>
          <span style={{ ...styles.metaValue, color }}>{pct}%</span>
        </div>
      </div>

      <div style={styles.barBg}>
        <div style={{
          ...styles.barFill,
          width: `${pct}%`,
          background: color,
        }} />
      </div>
    </div>
  );
}

const card = {
  background: "#1e293b",
  padding: "20px 22px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.06)",
  borderTop: "3px solid",
  transition: "border-color 0.4s, background 0.4s",
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
  estadoText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "22px",
    fontWeight: 800,
    color: "#f1f5f9",
    marginBottom: "18px",
  },
  row: {
    display: "flex",
    gap: "20px",
    marginBottom: "14px",
  },
  metaBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  metaLabel: {
    fontSize: "11px",
    color: "#64748b",
  },
  metaValue: {
    fontSize: "18px",
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
    color: "#f1f5f9",
  },
  barBg: {
    height: "6px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "99px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: "99px",
    transition: "width 0.6s cubic-bezier(0.4,0,0.2,1), background 0.4s",
  },
};

export default StatusCard;