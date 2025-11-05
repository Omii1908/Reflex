import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const CarLogo = () => (
  <Svg height="32" width="32" viewBox="0 0 24 24" fill="#F43F5E">
    <Path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </Svg>
);

const Header: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <CarLogo />
        <Text style={styles.title}>
          <Text style={styles.titleWhite}>REFLEX</Text>
          <Text style={styles.titleRed}>.</Text>
        </Text>
      </View>
      <Text style={styles.subtitle}>AI Accident Detection System</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Orbitron-Bold',
    marginLeft: 12,
    letterSpacing: 1.5,
  },
  titleWhite: {
    color: '#FFFFFF',
  },
  titleRed: {
    color: '#F43F5E',
  },
  subtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
});

export default Header;
