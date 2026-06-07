import { useState } from "react";
import { clearAuthAndDisconnect } from "../services/socket";
import { useNavigate } from "react-router-dom";
import "./ControlPanel.css";

const API_URL = import.meta.env.VITE_API_URL;

// We now accept the current breaker status as a prop
interface ControlPanelProps {
  breakerStatus?: "Open" | "Closed";
}

function ControlPanel({ breakerStatus = "Closed" }: ControlPanelProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendCommand = async (action: "OPEN" | "CLOSE") => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/control/breaker`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ action }),
      });

      if (res.status === 401 || res.status === 403) {
        clearAuthAndDisconnect();
        navigate("/login");
        return;
      }
    } catch (err) {
      console.error("Control error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthAndDisconnect();
    navigate("/login");
  };

  const isClosed = breakerStatus === "Closed";

  return (
    <div className="control-module">
      <div className="module-header">
        <h3>Breaker Control</h3>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {/* Fascinating Live Status Indicator */}
      <div className="status-display">
        <div className={`status-ring ${isClosed ? 'ring-closed' : 'ring-open'}`}>
          <span className="status-text">{breakerStatus}</span>
        </div>
      </div>

      <div className="control-buttons">
        <button 
          onClick={() => sendCommand("OPEN")} 
          disabled={loading || isClosed === false}
          className="cmd-btn cmd-open"
        >
          {loading ? "Processing..." : "TRIP (OPEN)"}
        </button>

        <button 
          onClick={() => sendCommand("CLOSE")} 
          disabled={loading || isClosed === true}
          className="cmd-btn cmd-close"
        >
          {loading ? "Processing..." : "CLOSE"}
        </button>
      </div>
    </div>
  );
}
export default ControlPanel;