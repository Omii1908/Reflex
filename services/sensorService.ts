
import { TripData, ContextualInfo, Location } from '../types';
import { CONTEXT_OPTIONS } from '../constants';

let lastData: TripData | null = null;
let isEventTriggered = false;
let eventCounter = 0;

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateNormalReading = (last: TripData | null): TripData => {
    const newSpeed = last ? Math.max(0, last.speed + (Math.random() - 0.5) * 10) : Math.random() * 60;
    
    // Simulate location change based on speed
    const newLocation = last ? {
        latitude: last.location.latitude + (Math.random() - 0.5) * 0.001 * (newSpeed / 100),
        longitude: last.location.longitude + (Math.random() - 0.5) * 0.001 * (newSpeed / 100)
    } : { latitude: 28.6139, longitude: 77.2090 }; // Start in Delhi

    return {
        timestamp: Date.now(),
        speed: newSpeed,
        accel: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: 9.8 + (Math.random() - 0.5) * 0.5,
        },
        gyro: {
            x: (Math.random() - 0.5) * 1,
            y: (Math.random() - 0.5) * 1,
            z: (Math.random() - 0.5) * 1,
        },
        location: newLocation,
        context: last ? last.context : {
            weather: getRandomElement(CONTEXT_OPTIONS.weather),
            traffic: getRandomElement(CONTEXT_OPTIONS.traffic),
            roadClass: getRandomElement(CONTEXT_OPTIONS.roadClass),
            regionType: getRandomElement(CONTEXT_OPTIONS.regionType),
        },
    };
};

const generateAccidentEventReading = (last: TripData): TripData => {
    eventCounter++;
    if (eventCounter > 2) { // Event lasts for 2 readings
        isEventTriggered = false;
        eventCounter = 0;
        return generateNormalReading(last);
    }
    return {
        ...last,
        timestamp: Date.now(),
        speed: last.speed * 0.1, // Drastic speed drop
        accel: {
            x: (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 15), // High G-force
            y: (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 15),
            z: 9.8 + (Math.random() - 0.5) * 20,
        },
        gyro: {
            x: (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 3), // High rotation
            y: (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 3),
            z: (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 3),
        },
    };
};


export const generateSensorData = (currentLocation: Location | null): TripData => {
    // Occasionally trigger a high-risk event
    if (!isEventTriggered && Math.random() < 0.1) {
        isEventTriggered = true;
        eventCounter = 0;
    }

    let newData: TripData;
    if (isEventTriggered && lastData) {
        newData = generateAccidentEventReading(lastData);
    } else {
        newData = generateNormalReading(lastData);
    }

    if (currentLocation) {
        newData.location = currentLocation;
    }
    
    lastData = newData;
    return newData;
};

export const resetSimulation = () => {
    lastData = null;
    isEventTriggered = false;
    eventCounter = 0;
}
