import StatusIndicator from "./StatusIndicator";

interface TelemetryCardProps {
  data: {
    title: string;
    value: string | number;
    status: "Normal" | "Warning" | "Critical";
  };
}

function TelemetryCard({ data }: TelemetryCardProps) {
  return (
    <div
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
        transition: "0.3s",
        cursor: "pointer",
        backgroundColor: "#0f172a",
        color: "white",
      }}
    >
      <h3 style={{ marginBottom: "8px" }}>{data.title}</h3>

      <p style={{ fontSize: "18px", margin: "8px 0" }}>
        {data.value}
      </p>

      <StatusIndicator
        status={data.status}
      />
    </div>
  );
}

export default TelemetryCard;