import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SensorReading } from '../types';

interface SensorChartProps {
  data: SensorReading[];
}

const HARD_BRAKING_THRESHOLD = -10;
const SUDDEN_ACCEL_THRESHOLD = 10;
const SHARP_TURN_THRESHOLD = 2;

const chartConfig = {
  backgroundColor: '#1F2937',
  backgroundGradientFrom: '#1F2937',
  backgroundGradientTo: '#1F2937',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '0', // No dots by default
  },
};

const screenWidth = Dimensions.get('window').width - 64; // container padding

const SensorChart: React.FC<SensorChartProps> = ({ data }) => {
  const chartData = data.map(d => ({
    timestamp: d.timestamp,
    accelX: d.accel.x,
    accelY: d.accel.y,
    accelZ: d.accel.z,
    gyroX: d.gyro.x,
    gyroY: d.gyro.y,
    gyroZ: d.gyro.z,
  }));

  const labels = chartData.map(d => new Date(d.timestamp).toLocaleTimeString().split(':')[2] || '');

  // FIX: Correctly use the `index` parameter to look up the full data point from `chartData`.
  // The `indexData` parameter from react-native-chart-kit is the single number value for the point, not the whole data object.
  const renderDotContent = (datasetName: 'accel' | 'gyro') => ({ x, y, index }: { x: number, y: number, index: number, indexData: any }) => {
    let eventColor: string | null = null;
    const pointData = chartData[index];

    if (!pointData) {
        return null;
    }

    if (datasetName === 'accel') {
      if (pointData.accelY <= HARD_BRAKING_THRESHOLD) eventColor = '#F43F5E'; // Red for braking
      if (pointData.accelY >= SUDDEN_ACCEL_THRESHOLD) eventColor = '#4ADE80'; // Green for accel
    }
    
    if (datasetName === 'gyro') {
      if (Math.abs(pointData.gyroZ) > SHARP_TURN_THRESHOLD) eventColor = '#38BDF8'; // Blue for turn
    }
    
    if (eventColor) {
      return <View key={`${datasetName}-${x}-${y}`} style={{ position: 'absolute', top: y - 4, left: x - 4, width: 8, height: 8, borderRadius: 4, backgroundColor: eventColor, borderColor: '#111827', borderWidth: 1 }} />;
    }
    
    return null;
  };
  
  // FIX: Correct function signature to accept string keys for flattened data and fix implementation to access data correctly.
  // The original signature expected keys of `SensorReading` ('accel', 'gyro'), causing type errors.
  // The original implementation would have caused a runtime error by trying to index a number.
  const renderChart = (title: string, keys: {name: string, color: string}[], datasetName: 'accel' | 'gyro') => {
    const datasets = keys.map(k => ({
        data: chartData.map(d => d[k.name as keyof typeof d]),
        color: (opacity = 1) => `${k.color}`,
        strokeWidth: 2,
    }));

    return (
        <View style={styles.chartContainer}>
            <Text style={styles.subtitle}>{title}</Text>
            {chartData.length > 1 ? (
                <LineChart
                    data={{ labels, datasets }}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    renderDotContent={renderDotContent(datasetName)}
                    yAxisLabel=""
                    yAxisSuffix=""
                />
            ) : (
                <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>Collect more data to display chart.</Text>
                </View>
            )}
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Data Visualization</Text>
       {renderChart('Accelerometer (m/s²)', [
            {name: 'accelX', color: '#F43F5E'}, 
            {name: 'accelY', color: '#FACC15'},
            {name: 'accelZ', color: '#38BDF8'},
        ], 'accel')}
       {renderChart('Gyroscope (rad/s)', [
            {name: 'gyroX', color: '#F43F5E'}, 
            {name: 'gyroY', color: '#FACC15'},
            {name: 'gyroZ', color: '#38BDF8'},
        ], 'gyro')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 16,
    gap: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#D1D5DB',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#D1D5DB',
    marginBottom: 8,
  },
  chartContainer: {
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  placeholder: {
      height: 220,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#374151',
      borderRadius: 16
  },
  placeholderText: {
      color: '#9CA3AF'
  }
});

export default SensorChart;