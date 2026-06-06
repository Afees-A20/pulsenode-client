import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ControlPanel from "../components/ControlPanel";
import TelemetryCard from "../components/TelemetryCard";
import AlarmPanel from "../components/AlarmPanel";
import { socket } from "../services/socket";

// SCADA system state
interface SystemState {
  breakerStatus: "Open" | "Closed";
}

// FIXED: telemetry is a LIVE OBJECT 
interface TelemetryData {
  transformerTemp: number;
  powerLoad: number;
  breakerStatus: string;
}

function Dashboard() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [systemState, setSystemState] = useState<SystemState | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const handleTelemetry = (data: TelemetryData) => {
      if (!data || typeof data !== "object") return;
      setTelemetry(data);
    };

    const handleSystemState = (state: SystemState) => {
      setSystemState(state);
    };

    socket.on("telemetry", handleTelemetry);
    socket.on("systemState", handleSystemState);
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.off("telemetry", handleTelemetry);
      socket.off("systemState", handleSystemState);
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const systemHealth =
    systemState?.breakerStatus === "Closed" && isConnected
      ? "GOOD"
      : "FAULT";

  return (
    <>
      <Navbar />

      <div className="dashboard-grid">
      
        {/* LEFT PANEL */}
        <div>
          {/* HEADER */}
          <div style={{ marginBottom: "16px" }}>
            <h1>PulseNode SCADA Dashboard</h1>

            <div style={{ display: "flex", gap: "12px", fontSize: "14px" }}>
              <span style={{ color: isConnected ? "green" : "red" }}>
                {isConnected ? "LIVE" : "OFFLINE"}
              </span>

              <span>HEALTH: {systemHealth}</span>
            </div>
          </div>

          {/* BREAKER STATUS */}
          <div
            style={{
              marginBottom: "20px",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor:
                systemState?.breakerStatus === "Open"
                  ? "#7f1d1d"
                  : "#166534",
              color: "white",
            }}
          >
            <strong>Breaker Status:</strong>{" "}
            {systemState?.breakerStatus ?? "Loading..."}
          </div>

          {/* TELEMETRY DISPLAY */}
          <div style={{ display: "grid", gap: "12px" }}>
            {telemetry && (
              <>
                <TelemetryCard
                  data={{
                    title: "Transformer Temperature",
                    value: `${telemetry.transformerTemp} °C`,
                    status:
                      telemetry.transformerTemp > 75
                        ? "Critical"
                        : telemetry.transformerTemp > 70
                        ? "Warning"
                        : "Normal",
                  }}
                />

                <TelemetryCard
                  data={{
                    title: "Power Load",
                    value: `${telemetry.powerLoad} %`,
                    status:
                      telemetry.powerLoad > 90
                        ? "Critical"
                        : telemetry.powerLoad > 80
                        ? "Warning"
                        : "Normal",
                  }}
                />
              </>
            )}
          </div>

          <ControlPanel />
        </div>

        {/* RIGHT PANEL */}
        <div>
          <h2>Alarm Center</h2>
          <AlarmPanel />
        </div>
      </div>
    </>
  );
}

export default Dashboard;