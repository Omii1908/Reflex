import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { DrivingAnalysis } from '../types';
import Svg, { Path } from 'react-native-svg';

interface DrivingPatternAnalysisProps {
  onAnalyze: () => void;
  analysis: DrivingAnalysis | null;
  isAnalyzing: boolean;
  isMonitoring: boolean;
  historyLength: number;
}

const BrakeIcon = () => <Svg height="32" width="32" viewBox="0 0 20 20" fill="#FACC15"><Path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></Svg>;
const AccelIcon = () => <Svg height="32" width="32" viewBox="0 0 20 20" fill="#4ADE80"><Path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></Svg>;
const TurnIcon = () => <Svg height="32" width="32" viewBox="0 0 20 20" fill="#38BDF8"><Path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></Svg>;
const LightbulbIcon = () => <Svg height="20" width="20" viewBox="0 0 20 20" fill="#9CA3AF" style={{marginRight: 8}}><Path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 14.95a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM4.343 5.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM14.95 14.95a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z" /><Path d="M10 6a4 4 0 100 8 4 4 0 000-8z" /></Svg>;
const AnalysisIcon = () => <Svg height="24" width="24" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2}><Path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></Svg>;

const Spinner: React.FC = () => {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const rotate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View style={{ transform: [{ rotate }] }}>
            <Svg height="32" width="32" fill="none" viewBox="0 0 24 24">
                <Path stroke="#38BDF8" strokeWidth="4" strokeOpacity="0.25" d="M12,2A10,10,0,1,1,2,12,10,10,0,0,1,12,2" />
                <Path stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" d="M12,2A10,10,0,0,1,22,12" />
            </Svg>
        </Animated.View>
    );
};

const DrivingPatternAnalysis: React.FC<DrivingPatternAnalysisProps> = ({ onAnalyze, analysis, isAnalyzing, isMonitoring, historyLength }) => {
  const canAnalyze = !isMonitoring && historyLength >= 10;
  
  const renderContent = () => {
    if (isAnalyzing) {
      return (
        <View style={styles.placeholder}>
            <Spinner />
            <Text style={[styles.placeholderText, {marginTop: 16}]}>Analyzing driving patterns...</Text>
        </View>
      );
    }
    if (analysis) {
        return (
            <View style={{ gap: 16 }}>
                <View>
                    <Text style={styles.subtitle}>Key Events Detected</Text>
                    <View style={styles.eventsContainer}>
                        <View style={styles.eventBox}>
                            <AccelIcon />
                            <Text style={styles.eventCount}>{analysis.suddenAccelerationEvents}</Text>
                            <Text style={styles.eventLabel}>Sudden Accels</Text>
                        </View>
                        <View style={styles.eventBox}>
                            <BrakeIcon />
                            <Text style={styles.eventCount}>{analysis.hardBrakingEvents}</Text>
                            <Text style={styles.eventLabel}>Hard Braking</Text>
                        </View>
                        <View style={styles.eventBox}>
                            <TurnIcon />
                            <Text style={styles.eventCount}>{analysis.sharpTurnEvents}</Text>
                            <Text style={styles.eventLabel}>Sharp Turns</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={styles.subtitle}>AI Summary</Text>
                    <Text style={styles.summaryText}>"{analysis.summary}"</Text>
                </View>
                <View>
                    <Text style={styles.subtitle}>Recommendations</Text>
                     {analysis.recommendations.map((rec, index) => (
                        <View key={index} style={styles.recommendationItem}>
                            <LightbulbIcon />
                            <Text style={styles.recommendationText}>{rec}</Text>
                        </View>
                    ))}
                </View>
            </View>
        )
    }
    return (
        <View style={styles.placeholder}>
            <AnalysisIcon />
            <Text style={[styles.placeholderText, { marginTop: 16, marginBottom: 16 }]}>Analyze the trip's sensor data for driving patterns.</Text>
            <TouchableOpacity
                onPress={onAnalyze}
                disabled={!canAnalyze || isAnalyzing}
                style={[styles.button, (!canAnalyze || isAnalyzing) && styles.disabledButton]}
            >
                <Text style={styles.buttonText}>Analyze Trip History</Text>
            </TouchableOpacity>
            {!canAnalyze && <Text style={styles.disabledText}>
                {isMonitoring ? "Stop the current trip to enable analysis." : "A minimum of 10 data points is required."}
            </Text>}
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Pattern Analysis</Text>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1F2937',
        padding: 16,
        borderRadius: 16,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Inter-SemiBold',
        color: '#D1D5DB',
        marginBottom: 16,
    },
    subtitle: {
        fontFamily: 'Inter-SemiBold',
        color: '#D1D5DB',
        marginBottom: 8,
        fontSize: 16,
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    placeholderText: {
        color: '#9CA3AF',
        textAlign: 'center',
    },
    button: {
        width: '100%',
        maxWidth: 300,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: 'rgba(56, 189, 248, 0.8)',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Inter-SemiBold',
        color: '#FFF',
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: '#4B5563',
    },
    disabledText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 8,
    },
    eventsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    eventBox: {
        flex: 1,
        backgroundColor: 'rgba(55, 65, 81, 0.5)',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        gap: 4
    },
    eventCount: {
        fontSize: 24,
        fontFamily: 'Orbitron-Bold',
        color: '#FFF',
    },
    eventLabel: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    summaryText: {
        fontStyle: 'italic',
        color: '#9CA3AF',
    },
    recommendationItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    recommendationText: {
        flex: 1,
        color: '#9CA3AF',
    }
});

export default DrivingPatternAnalysis;
