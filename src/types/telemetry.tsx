// telemetry.ts
// Defines the structure of telemetry data.
// This creates a consistent contract across the application.

export interface TelemetryData {
  title: string;
  value: string;
  status: string;
}