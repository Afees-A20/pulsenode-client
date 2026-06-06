import { useEffect, useState } from "react";
import { socket } from "../services/socket";

const API_URL = import.meta.env.VITE_API_URL;

// TEMPORARY DEMO ROLE (will later come from JWT)
const role = "Operator";

interface Alarm {
  _id: string;
  message: string;
  severity: "Critical" | "Warning";
  acknowledged: boolean;
  createdAt: string;
}

function AlarmPanel() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "acknowledged">(
    "all"
  );

  // INITIAL LOAD
  const fetchAlarms = async () => {
    try {
      const res = await fetch(`${API_URL}/api/alarms`);
      const data: Alarm[] = await res.json();
      setAlarms(data);
    } catch (err) {
      console.error("Failed to load alarms:", err);
    }
  };

  useEffect(() => {
    void fetchAlarms();

    // REAL-TIME ALARM STREAM
    socket.on("alarm:new", (alarm: Alarm) => {
      setAlarms((prev) =>
        [alarm, ...prev].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
      );
    });

    return () => {
      socket.off("alarm:new");
    };
  }, []);

  // ACKNOWLEDGE ALARM
  const acknowledgeAlarm = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/alarms/ack/${id}`, {
        method: "POST",
      });

      setAlarms((prev) =>
        prev.map((alarm) =>
          alarm._id === id
            ? { ...alarm, acknowledged: true }
            : alarm
        )
      );
    } catch (err) {
      console.error("Ack failed:", err);
    }
  };

  const filteredAlarms = alarms.filter((alarm) => {
    if (filter === "active") return !alarm.acknowledged;
    if (filter === "acknowledged") return alarm.acknowledged;
    return true;
  });

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>🚨 Live Alarm Panel</h2>

      {/* FILTER BUTTONS */}
      <div style={{ marginBottom: "12px" }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("acknowledged")}>
          Acknowledged
        </button>
      </div>

      {/* ALARMS */}
      {filteredAlarms.map((alarm) => {
        // SCADA RULE:
        const canAcknowledge =
          !(role === "Operator" && alarm.severity === "Critical");

        return (
          <div
            key={alarm._id}
            style={{
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "6px",
              color: "white",
              background:
                alarm.severity === "Critical"
                  ? "#7f1d1d"
                  : "#92400e",
            }}
          >
            <p>{alarm.message}</p>
            <small>{alarm.severity}</small>

            {/* ACK BUTTON (FIXED CLEAN LOGIC) */}
            {!alarm.acknowledged && canAcknowledge && (
              <button
                onClick={() => acknowledgeAlarm(alarm._id)}
                style={{ marginLeft: "10px" }}
              >
                ACK
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AlarmPanel;