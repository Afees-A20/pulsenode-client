import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

// Safety check (prevents silent failure)
if (!API_URL) {
  throw new Error("VITE_API_URL is not defined in environment variables");
}

export const socket = io(API_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true,
});

// Debug logs (safe for development)
socket.on("connect", () => {
  console.log("🟢 SCADA connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 SCADA disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.log("⚠️ SCADA connection error:", err.message);
});