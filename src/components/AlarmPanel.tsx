import { useState, useEffect } from "react";
import { socket } from "../services/socket";
import "./AlarmPanel.css";

const API_URL = import.meta.env.VITE_API_URL;

interface Alarm {
  _id: string;
  key: string;
  message: string;
  severity: "Critical" | "Warning";
  acknowledged: boolean;
  createdAt: string;
}

function AlarmPanel() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "ack">("all");

  // Fetch initial alarms
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/alarms`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAlarms(data))
      .catch(err => console.error("Failed to fetch alarms", err));
  }, []);

  // Listen for live alarms
  useEffect(() => {
    const handleNewAlarm = (newAlarm: Alarm) => {
      setAlarms(prev => [newAlarm, ...prev]);
    };
    socket.on("alarm:new", handleNewAlarm);
    return () => { socket.off("alarm:new", handleNewAlarm); };
  }, []);

  const filteredAlarms = alarms.filter(alarm => {
    if (filter === "active") return !alarm.acknowledged;
    if (filter === "ack") return alarm.acknowledged;
    return true;
  });

  return (
    <div className="alarm-module">
      <div className="alarm-header">
        <h3>Alarm Center</h3>
        <span className="alarm-count">{alarms.length} Total</span>
      </div>

      {/* Modern Tabs */}
      <div className="alarm-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active</button>
        <button className={filter === 'ack' ? 'active' : ''} onClick={() => setFilter('ack')}>Acknowledged</button>
      </div>

      {/* Alarm List with proper spacing */}
      <div className="alarm-list">
        {filteredAlarms.length === 0 ? (
          <div className="no-alarms">No alarms in this category.</div>
        ) : (
          filteredAlarms.map(alarm => (
            <div key={alarm._id} className={`alarm-card ${alarm.acknowledged ? 'acknowledged' : ''}`}>
              <div className="alarm-info">
                <span className={`severity-badge ${alarm.severity.toLowerCase()}`}>
                  {alarm.severity}
                </span>
                <p className="alarm-message">{alarm.message}</p>
                <span className="alarm-time">
                  {new Date(alarm.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default AlarmPanel;