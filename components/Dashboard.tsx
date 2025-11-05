import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Alert, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { TripData, SensorReading, EmergencyContact, Location as LocationType, DrivingAnalysis } from '../types';
import { SENSOR_UPDATE_INTERVAL_MS, RISK_ALERT_THRESHOLD, INITIAL_EMERGENCY_CONTACTS } from '../constants';
import { generateSensorData, resetSimulation } from '../services/sensorService';
import { getRiskAssessment, RiskAssessment, getDrivingPatternAnalysis } from '../services/geminiService';
import RiskMeter from './RiskMeter';
import SensorChart from './SensorChart';
import ContextPanel from './ContextPanel';
import EmergencyContacts from './EmergencyContacts';
import Controls from './Controls';
import AlertModal from './AlertModal';
import MapView from './MapView';
import DrivingPatternAnalysis from './DrivingPatternAnalysis';

const Dashboard: React.FC = () => {
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAlerting, setIsAlerting] = useState(false);
    const [currentData, setCurrentData] = useState<TripData | null>(null);
    const [sensorHistory, setSensorHistory] = useState<SensorReading[]>([]);
    const [risk, setRisk] = useState<RiskAssessment>({ riskScore: 0, analysis: 'System Idle' });
    const [contacts] = useState<EmergencyContact[]>(INITIAL_EMERGENCY_CONTACTS);
    const [location, setLocation] = useState<LocationType | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isSharingLocation, setIsSharingLocation] = useState(false);
    const [drivingAnalysis, setDrivingAnalysis] = useState<DrivingAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const stopMonitoring = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsMonitoring(false);
        setIsSharingLocation(false);
        setCurrentData(null);
        setRisk({ riskScore: 0, analysis: 'Monitoring stopped. Analyze trip.' });
        resetSimulation();
    }, []);

    const startMonitoring = () => {
        stopMonitoring();
        setIsMonitoring(true);
        setIsLoading(true);
        setIsSharingLocation(false);
        setSensorHistory([]);
        setDrivingAnalysis(null);

        intervalRef.current = setInterval(async () => {
            const newData = generateSensorData(location);
            setCurrentData(newData);
            setSensorHistory(prev => [...prev.slice(-49), { timestamp: newData.timestamp, accel: newData.accel, gyro: newData.gyro }]);
            
            try {
                const assessment = await getRiskAssessment(newData);
                setRisk(assessment);
                if (assessment.riskScore > RISK_ALERT_THRESHOLD) {
                    setIsAlerting(true);
                }
            } catch(e) {
                console.error("Failed to get AI assessment", e);
                setRisk({ riskScore: 0, analysis: 'AI service unavailable.' });
            } finally {
                setIsLoading(false);
            }
        }, SENSOR_UPDATE_INTERVAL_MS);
    };

    const handleAnalyzeTrip = async () => {
        if (sensorHistory.length < 10) return;
        setIsAnalyzing(true);
        setDrivingAnalysis(null);
        try {
            const analysisResult = await getDrivingPatternAnalysis(sensorHistory);
            setDrivingAnalysis(analysisResult);
        } catch (error) {
            console.error("Failed to analyze trip", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleToggleLocationSharing = () => {
        if (!isMonitoring) return;
        setIsSharingLocation(prev => !prev);
    };
    
    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setLocationError('Permission to access location was denied');
            setLocation({ latitude: 28.6139, longitude: 77.2090 }); // Default
            return;
          }
    
          let locationResult = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: locationResult.coords.latitude,
            longitude: locationResult.coords.longitude
          });
          setLocationError(null);
        })();
    }, []);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleCancelAlert = () => setIsAlerting(false);

    const handleAlertConfirm = () => {
        setIsAlerting(false);
        stopMonitoring();
        Alert.alert("Emergency Action", "Emergency contacts have been notified!");
    };

    return (
        <ScrollView style={styles.container}>
            <AlertModal
                isOpen={isAlerting}
                onCancel={handleCancelAlert}
                onConfirm={handleAlertConfirm}
                riskScore={risk.riskScore}
                location={currentData?.location}
            />
            <View style={styles.section}>
                <RiskMeter riskScore={risk.riskScore} analysis={risk.analysis} isLoading={isLoading && isMonitoring} />
            </View>
            <View style={styles.section}>
                <Controls onStart={startMonitoring} onStop={stopMonitoring} isMonitoring={isMonitoring} />
            </View>
             <View style={styles.section}>
                <EmergencyContacts 
                    contacts={contacts} 
                    isSharingLocation={isSharingLocation}
                    onToggleShare={handleToggleLocationSharing}
                    isMonitoring={isMonitoring}
                />
            </View>
            <View style={styles.section}>
                <ContextPanel data={currentData} isMonitoring={isMonitoring} />
            </View>
            <View style={styles.section}>
                <MapView location={currentData?.location} error={locationError}/>
            </View>
            <View style={styles.section}>
                <SensorChart data={sensorHistory} />
            </View>
            <View style={styles.section}>
                 <DrivingPatternAnalysis 
                    onAnalyze={handleAnalyzeTrip}
                    analysis={drivingAnalysis}
                    isAnalyzing={isAnalyzing}
                    isMonitoring={isMonitoring}
                    historyLength={sensorHistory.length}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
    }
});

export default Dashboard;
