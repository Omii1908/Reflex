import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ALERT_COUNTDOWN_SECONDS } from '../constants';
import { Location } from '../types';

interface AlertModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  riskScore: number;
  location: Location | null | undefined;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onCancel, onConfirm, riskScore, location }) => {
  const [countdown, setCountdown] = useState(ALERT_COUNTDOWN_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCountdown(ALERT_COUNTDOWN_SECONDS);
      timerRef.current = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (countdown <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      onConfirm();
    }
  }, [countdown, onConfirm]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (countdown / ALERT_COUNTDOWN_SECONDS) * circumference;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>HIGH-RISK EVENT DETECTED</Text>
          <Text style={styles.subtitle}>A potential accident has been detected based on sensor data.</Text>
          
          <View style={styles.countdownContainer}>
            <Svg width="120" height="120" viewBox="0 0 120 120">
              <Circle cx="60" cy="60" r={radius} stroke="#4B5563" strokeWidth="8" fill="transparent" />
              <Circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#F43F5E"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </Svg>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
          
          <Text style={styles.infoText}>
            Emergency contacts will be notified automatically unless you cancel.
          </Text>
           <Text style={styles.infoTextSmall}>
            Risk: {riskScore}% | Loc: {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'N/A'}
          </Text>

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel Alert - I'm OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#F43F5E',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 24,
    color: '#F43F5E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#D1D5DB',
    textAlign: 'center',
    marginBottom: 24,
  },
  countdownContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  countdownText: {
    position: 'absolute',
    fontFamily: 'Orbitron-Bold',
    fontSize: 48,
    color: '#FFFFFF',
  },
  infoText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  infoTextSmall: {
     color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
  },
  cancelButton: {
    backgroundColor: 'rgba(74, 222, 128, 0.8)',
    borderRadius: 8,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
});

export default AlertModal;
