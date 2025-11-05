import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ControlsProps {
  onStart: () => void;
  onStop: () => void;
  isMonitoring: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onStart, onStop, isMonitoring }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>System Control</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onStart}
          disabled={isMonitoring}
          style={[styles.button, styles.startButton, isMonitoring && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>Start Trip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onStop}
          disabled={!isMonitoring}
          style={[styles.button, styles.stopButton, !isMonitoring && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>Stop Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    padding: 24,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#D1D5DB',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: 'rgba(74, 222, 128, 0.8)',
    marginRight: 8,
  },
  stopButton: {
    backgroundColor: 'rgba(244, 63, 94, 0.8)',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#4B5563',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});

export default Controls;
