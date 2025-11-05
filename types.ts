
export interface SensorReading {
  timestamp: number;
  accel: { x: number; y: number; z: number };
  gyro: { x: number; y: number; z: number };
}

export interface ContextualInfo {
  weather: string;
  traffic: string;
  roadClass: string;
  regionType: string;
}

export interface Location {
    latitude: number;
    longitude: number;
}

export interface TripData extends SensorReading {
    speed: number;
    location: Location;
    context: ContextualInfo;
}

export interface EmergencyContact {
    id: number;
    name: string;
    phone: string;
    relation: string;
}

export interface TrafficData {
  condition: 'Flowing' | 'Slow' | 'Congested';
  averageSpeed: number;
  description: string;
}

export interface DrivingAnalysis {
  hardBrakingEvents: number;
  suddenAccelerationEvents: number;
  sharpTurnEvents: number;
  summary: string;
  recommendations: string[];
}