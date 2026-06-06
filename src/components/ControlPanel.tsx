import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function ControlPanel() {
  const [loading, setLoading] = useState(false);

  const sendCommand = async (action: "OPEN" | "CLOSE") => {
    setLoading(true);

    try {
      // SIMPLE SCADA PASSWORD PROMPT
      const password = prompt("Enter SCADA control password");

      const res = await fetch(`${API_URL}/control/breaker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          password,
        }),
      });

      const data = await res.json();
      console.log("Control response:", data);
    } catch (err) {
      console.error("Control error:", err);
    }

    setLoading(false);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Control Panel</h3>

      <button onClick={() => sendCommand("OPEN")} disabled={loading}>
        Open Breaker
      </button>

      <button
        onClick={() => sendCommand("CLOSE")}
        disabled={loading}
        style={{ marginLeft: "10px" }}
      >
        Close Breaker
      </button>
    </div>
  );
}

export default ControlPanel;