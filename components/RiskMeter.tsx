import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface RiskMeterProps {
  riskScore: number;
  analysis: string;
  isLoading: boolean;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ riskScore, analysis, isLoading }) => {
  const score = Math.min(Math.max(riskScore, 0), 100);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score > 75) return '#F43F5E';
    if (score > 40) return '#FACC15';
    return '#4ADE80';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Risk Meter</Text>
      <View style={styles.meterContainer}>
        <Svg width="200" height="200" viewBox="0 0 200 200">
          <Circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#374151"
            strokeWidth="15"
            fill="transparent"
          />
          <Circle
            cx="100"
            cy="100"
            r={radius}
            stroke={getColor()}
            strokeWidth="15"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
        </Svg>
        <View style={styles.textContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#9CA3AF" />
          ) : (
            <>
              <Text style={[styles.scoreText, { color: getColor() }]}>{score}</Text>
              <Text style={styles.percentText}>%</Text>
            </>
          )}
        </View>
      </View>
      <View style={styles.analysisContainer}>
        <Text style={styles.analysisText}>
          {isLoading ? 'Analyzing data...' : analysis}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#D1D5DB',
    marginBottom: 16,
  },
  meterContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 60,
  },
  percentText: {
    fontSize: 18,
    color: '#9CA3AF',
    marginTop: -10,
  },
  analysisContainer: {
    marginTop: 16,
    height: 48,
    justifyContent: 'center',
  },
  analysisText: {
    color: '#D1D5DB',
    fontStyle: 'italic',
  },
});

export default RiskMeter;
