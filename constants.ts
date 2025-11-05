
import { EmergencyContact } from './types';

export const SENSOR_UPDATE_INTERVAL_MS = 2000;
export const RISK_ALERT_THRESHOLD = 75;
export const ALERT_COUNTDOWN_SECONDS = 10;

export const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
    { id: 1, name: 'Priya Sharma', phone: '+91 98765 43210', relation: 'Spouse' },
    { id: 2, name: 'Arjun Singh', phone: '+91 87654 32109', relation: 'Brother' },
    { id: 3, name: 'Dr. Ramesh Gupta', phone: '+91 76543 21098', relation: 'Family Doctor' },
];

export const CONTEXT_OPTIONS = {
    weather: ['Clear', 'Rainy', 'Foggy', 'Cloudy'],
    traffic: ['Light', 'Moderate', 'Heavy', 'Gridlock'],
    roadClass: ['Highway', 'City Street', 'Rural Road', 'Mountain Pass'],
    regionType: ['Urban', 'Suburban', 'Rural'],
};
