// src/services/socket.ts
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined in environment variables");
}

// Helper to get current auth payload
const getAuth = () => {
  const token = localStorage.getItem("token");
  return token ? { token } : {};
};

export const socket = io(API_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: false, // We will connect manually after checking auth
  auth: getAuth(),
});

// Call this when user logs in
export const connectWithAuth = () => {
  socket.auth = getAuth();
  if (!socket.connected) {
    socket.connect();
  }
};

// Call this when user logs out
export const clearAuthAndDisconnect = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  socket.auth = {};
  socket.disconnect();
};

socket.on("connect", () => {
  console.log("🟢 SCADA connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 SCADA disconnected:", reason);
});

// FIXED: Handle expired/invalid tokens automatically
socket.on("connect_error", (err) => {
  console.log("⚠️ SCADA connection error:", err.message);
  
  // If the backend rejects the token, clear local storage and force logout
  if (err.message.includes("Authentication error")) {
    console.warn("Token invalid or expired. Forcing logout...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Force a hard redirect to the login page
    window.location.href = "/login"; 
  }
});