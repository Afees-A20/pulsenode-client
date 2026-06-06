// StatusIndicator.tsx
// Displays system health status visually.

interface StatusIndicatorProps {
  status: "Normal" | "Warning" | "Critical";
}

function StatusIndicator({
  status,
}: StatusIndicatorProps) {
  let color: string;

  if (status === "Normal") {
    color = "green";
  } else if (status === "Warning") {
    color = "orange";
  } else {
    color = "red";
  }

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "6px",
        backgroundColor: color,
        color: "white",
        fontWeight: "bold",
      }}
    >
      {status}
    </span>
  );
}

export default StatusIndicator;