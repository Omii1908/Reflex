import { Location, TrafficData } from '../types';

const trafficConditions = [
    { condition: 'Flowing', minSpeed: 60, maxSpeed: 100, description: 'Traffic is moving smoothly.' },
    { condition: 'Slow', minSpeed: 20, maxSpeed: 59, description: 'Minor slowdowns reported in the area.' },
    { condition: 'Congested', minSpeed: 5, maxSpeed: 19, description: 'Heavy congestion, expect delays.' },
];

// Simulate an async API call to a traffic service
export const getTrafficConditions = async (location: Location): Promise<TrafficData> => {
    // In a real app, you would use the location to query a traffic API.
    // Here, we'll just simulate it with random data.
    return new Promise(resolve => {
        setTimeout(() => {
            const randomCondition = trafficConditions[Math.floor(Math.random() * trafficConditions.length)];
            const averageSpeed = Math.floor(Math.random() * (randomCondition.maxSpeed - randomCondition.minSpeed + 1)) + randomCondition.minSpeed;

            resolve({
                condition: randomCondition.condition as 'Flowing' | 'Slow' | 'Congested',
                averageSpeed: averageSpeed,
                description: randomCondition.description,
            });
        }, 500); // Simulate network latency
    });
};
