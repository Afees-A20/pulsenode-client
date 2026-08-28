# PulseNode Frontend

Modern, real-time dashboard for the PulseNode SCADA backend. Built with React, TypeScript, and Vite. Deployed on Vercel.

## Core Features
- **Live Telemetry Dashboard:** Real-time visualization of system load and temperature via WebSocket integration.
- **Alarm Management Panel:** Live feed of critical and warning alarms with auto-updating status.
- **Secure Control Interface:** UI for breaker toggling, restricted to authenticated Admin/Engineer roles via JWT.
- **Responsive Design:** Clean, intuitive interface optimized for monitoring environments.

## Tech Stack
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (or your specific CSS framework)
- **Deployment:** Vercel

## Local Setup
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file with `VITE_API_URL` (pointing to your backend).
4. Run `npm run dev` to start the client.
