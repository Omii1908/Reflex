
import { GoogleGenAI } from "@google/genai";
import { TripData, SensorReading, DrivingAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface RiskAssessment {
    riskScore: number;
    analysis: string;
}

export const getRiskAssessment = async (data: TripData): Promise<RiskAssessment> => {
    const prompt = `
    You are REFLEX, an advanced AI system that assesses the risk of a vehicle accident in real-time based on smartphone sensor data. Your task is to analyze the following data for Indian road conditions and provide a risk assessment.

    **Input Data:**
    - Speed: ${data.speed.toFixed(2)} km/h
    - Accelerometer (X, Y, Z): ${data.accel.x.toFixed(2)}, ${data.accel.y.toFixed(2)}, ${data.accel.z.toFixed(2)} m/s²
    - Gyroscope (X, Y, Z): ${data.gyro.x.toFixed(2)}, ${data.gyro.y.toFixed(2)}, ${data.gyro.z.toFixed(2)} rad/s
    - Location: Latitude ${data.location.latitude.toFixed(4)}, Longitude ${data.location.longitude.toFixed(4)}
    - Context:
      - Weather: ${data.context.weather}
      - Traffic: ${data.context.traffic}
      - Road Type: ${data.context.roadClass}
      - Region: ${data.context.regionType}

    **Analysis Guidelines:**
    - Normal Accelerometer Z is ~9.8 m/s² (gravity).
    - High-risk indicators: Sudden, large spikes in Accelerometer readings (e.g., > 20 m/s²), high rotational velocity from Gyroscope (e.g., > 3 rad/s), or an abrupt stop from high speed.
    - Contextual factors: Rainy weather, heavy traffic, mountain passes, and night time increase baseline risk.

    **Your Response:**
    Respond ONLY with a single, valid JSON object. Do not include any other text, explanations, or markdown formatting. The JSON object must have the following structure:
    {
      "riskScore": <a number between 0 and 100>,
      "analysis": "<a brief, one-sentence analysis of the situation (max 15 words)>"
    }

    Analyze the provided data and generate your response.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text.trim();
        const result = JSON.parse(text);
        
        if (typeof result.riskScore === 'number' && typeof result.analysis === 'string') {
            return result;
        } else {
            console.error("Invalid JSON structure from Gemini", result);
            return { riskScore: 0, analysis: "AI response format error." };
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return { riskScore: 0, analysis: "Error assessing risk." };
    }
};

export const getDrivingPatternAnalysis = async (history: SensorReading[]): Promise<DrivingAnalysis> => {
    const serializedHistory = history.map(d => `{ts:${d.timestamp},ax:${d.accel.x.toFixed(2)},ay:${d.accel.y.toFixed(2)},az:${d.accel.z.toFixed(2)},gx:${d.gyro.x.toFixed(2)},gy:${d.gyro.y.toFixed(2)},gz:${d.gyro.z.toFixed(2)}}`).join(',');

    const prompt = `
    You are REFLEX, an advanced AI system that analyzes historical driving data from a trip to identify patterns and provide feedback. Your task is to analyze the following time-series sensor data from Indian road conditions.

    **Input Data Format:**
    A comma-separated list of sensor readings. Each reading is a JSON-like object with:
    - ts: timestamp (for sequence)
    - ax, ay, az: Accelerometer readings (m/s²)
    - gx, gy, gz: Gyroscope readings (rad/s)

    **Data Snippet:**
    [${serializedHistory.substring(0, 300)}...]

    **Analysis Task:**
    Analyze the FULL dataset provided to identify key driving events. Count the occurrences of each event type based on these thresholds:
    1.  **Hard Braking:** Any instance where Accelerometer Y (ay) is less than -10 m/s².
    2.  **Sudden Acceleration:** Any instance where Accelerometer Y (ay) is greater than +10 m/s².
    3.  **Sharp Turn:** Any instance where Gyroscope Z (gz) is outside the range of -2 to 2 rad/s.

    Based on the frequency and severity of these events, provide a concise summary of the driving style and actionable recommendations for improvement.

    **Your Response:**
    Respond ONLY with a single, valid JSON object. Do not include any other text, explanations, or markdown formatting. The JSON object must have the following structure:
    {
      "hardBrakingEvents": <count of events>,
      "suddenAccelerationEvents": <count of events>,
      "sharpTurnEvents": <count of events>,
      "summary": "<A one or two-sentence summary of the overall driving style observed.>",
      "recommendations": [
        "<A short, actionable recommendation>",
        "<Another short, actionable recommendation>"
      ]
    }

    Analyze the complete dataset and generate your response.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text.trim();
        const result = JSON.parse(text);

        if (
            typeof result.hardBrakingEvents === 'number' &&
            typeof result.suddenAccelerationEvents === 'number' &&
            typeof result.sharpTurnEvents === 'number' &&
            typeof result.summary === 'string' &&
            Array.isArray(result.recommendations)
        ) {
            return result;
        } else {
            console.error("Invalid JSON structure from Gemini for pattern analysis", result);
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        console.error("Error calling Gemini API for pattern analysis:", error);
        return {
            hardBrakingEvents: 0,
            suddenAccelerationEvents: 0,
            sharpTurnEvents: 0,
            summary: "Failed to analyze driving patterns due to an AI service error.",
            recommendations: ["Please try again later."]
        };
    }
};
