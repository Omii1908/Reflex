import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Orbitron_400Regular, Orbitron_700Bold } from '@expo-google-fonts/orbitron';

import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { View } from 'react-native';

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Orbitron-Regular': Orbitron_400Regular,
    'Orbitron-Bold': Orbitron_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={styles.container} />; // Or a custom loading component
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <Header />
      <Dashboard />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    fontFamily: 'Inter-Regular',
  },
});

export default App;
