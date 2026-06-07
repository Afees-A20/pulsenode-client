// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import type { ReactNode } from "react"; // FIXED: Must be imported as a type in modern Vite/TS

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { connectWithAuth } from "./services/socket";

// 1. PROTECTED ROUTE (For the Dashboard)
function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (token) connectWithAuth();
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// 2. PUBLIC ROUTE (For the Login page)
function PublicRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("token");
  
  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: Login page */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Protected Route: Dashboard */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all route for broken URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;