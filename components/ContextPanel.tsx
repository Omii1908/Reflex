import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TripData, TrafficData, Location } from '../types';
import { getTrafficConditions } from '../services/trafficService';
import Svg, { Path, Circle } from 'react-native-svg';


interface ContextPanelProps {
  data: TripData | null;
  isMonitoring: boolean;
}

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <View style={styles.infoItemContainer}>
        <View style={styles.iconContainer}>{icon}</View>
        <View>
            <Text style={styles.infoItemLabel}>{label}</Text>
            <Text style={styles.infoItemValue}>{value}</Text>
        </View>
    </View>
);

const SpeedIcon = () => <Svg height="20" width="20" viewBox="0 0 20 20" fill="#E5E7EB"><Path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></Svg>;
const WeatherIcon = () => <Svg height="20" width="20" viewBox="0 0 20 20" fill="#E5E7EB"><Path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201-4.459 4 4 0 117.898 3.055 5.5 5.5 0 011.303 1.404zM12 4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" /></Svg>;
const RoadIcon = () => <Svg height="20" width="20" viewBox="0 0 20 20" fill="#E5E7EB"><Path d="M4 4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v10H4V6zm4 2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V8zm-3 4a1 1 0 100 2h10a1 1 0 100-2H5z" /></Svg>;

const TrafficStatusIndicator: React.FC<{ condition: TrafficData['condition'] | null }> = ({ condition }) => {
    let color = "#6B7280";
    let label = "Unknown";
    
    if (condition === 'Flowing') {
        color = "#4ADE80";
        label = "Flowing";
    } else if (condition === 'Slow') {
        color = "#FACC15";
        label = "Slow";
    } else if (condition === 'Congested') {
        color = "#F43F5E";
        label = "Congested";
    }

    return (
        <View style={styles.trafficStatusContainer}>
            <View style={[styles.trafficStatusDot, { backgroundColor: color }]} />
            <Text style={styles.infoItemValue}>{label}</Text>
        </View>
    );
};

const ContextPanel: React.FC<ContextPanelProps> = ({ data, isMonitoring }) => {
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const locationRef = useRef<Location | null>(null);

  useEffect(() => {
    locationRef.current = data?.location ?? null;
  }, [data]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchTraffic = async () => {
      if (locationRef.current) {
        try {
          const trafficData = await getTrafficConditions(locationRef.current);
          setTraffic(trafficData);
        } catch (error) {
          console.error("Failed to fetch traffic conditions:", error);
        }
      }
    };

    if (isMonitoring) {
      fetchTraffic();
      intervalId = setInterval(fetchTraffic, 3000);
    } else {
      setTraffic(null);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isMonitoring]);

  return (
    <View style={styles.panelContainer}>
      <Text style={styles.title}>Trip Context</Text>
      <View style={styles.infoSection}>
        <InfoItem icon={<SpeedIcon />} label="Current Speed" value={data ? `${data.speed.toFixed(0)} km/h` : 'N/A'} />
        <InfoItem icon={<WeatherIcon />} label="Weather" value={data?.context.weather || 'N/A'} />
        <InfoItem icon={<RoadIcon />} label="Road Type" value={data?.context.roadClass || 'N/A'} />
      </View>
       <View style={styles.trafficSection}>
        <Text style={styles.subtitle}>Live Traffic</Text>
        { isMonitoring ? (
            traffic ? (
                <View style={styles.trafficDetails}>
                    <View style={styles.trafficRow}>
                        <Text style={styles.infoItemLabel}>Condition</Text>
                        <TrafficStatusIndicator condition={traffic.condition} />
                    </View>
                     <View style={styles.trafficRow}>
                        <Text style={styles.infoItemLabel}>Avg. Area Speed</Text>
                        <Text style={styles.infoItemValue}>{traffic.averageSpeed} km/h</Text>
                    </View>
                     <Text style={styles.trafficDescription}>{traffic.description}</Text>
                </View>
            ) : (
                 <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>Fetching traffic data...</Text>
                </View>
            )
        ) : (
             <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>Start monitoring to see live traffic.</Text>
            </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 16,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#D1D5DB',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#D1D5DB',
    marginBottom: 12,
  },
  infoSection: {
    flexGrow: 1,
  },
  infoItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    backgroundColor: '#374151',
    padding: 8,
    borderRadius: 999,
    marginRight: 12,
  },
  infoItemLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoItemValue: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#E5E7EB',
  },
  trafficSection: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    marginTop: 16,
    paddingTop: 16,
  },
  trafficDetails: {
  },
  trafficRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trafficStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trafficStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  trafficDescription: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingTop: 8,
  },
  placeholderContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#6B7280',
    fontSize: 14,
  },
});

export default ContextPanel;
