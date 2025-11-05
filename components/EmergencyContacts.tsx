import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { EmergencyContact } from '../types';
import Svg, { Path } from 'react-native-svg';

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  isSharingLocation: boolean;
  onToggleShare: () => void;
  isMonitoring: boolean;
}

const UserIcon = () => <Svg height="24" width="24" viewBox="0 0 20 20" fill="#38BDF8"><Path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></Svg>;

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ contacts, isSharingLocation, onToggleShare, isMonitoring }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Contacts</Text>
        <View style={styles.toggleContainer}>
            <Text style={[styles.toggleLabel, isMonitoring && isSharingLocation && {color: '#38BDF8'}]}>
                Share Live Location
            </Text>
            <Switch
                trackColor={{ false: '#4B5563', true: '#38BDF8' }}
                thumbColor={isSharingLocation ? '#FFFFFF' : '#D1D5DB'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={onToggleShare}
                value={isSharingLocation}
                disabled={!isMonitoring}
            />
        </View>
      </View>
      <View style={styles.listContainer}>
        {contacts.map(contact => (
          <View key={contact.id} style={styles.contactItem}>
            <UserIcon />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactDetails}>{contact.relation} - {contact.phone}</Text>
            </View>
            {isMonitoring && isSharingLocation && (
                <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#D1D5DB',
    flex: 1,
  },
  toggleContainer: {
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  listContainer: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    padding: 12,
    borderRadius: 8,
  },
  contactInfo: {
    marginLeft: 16,
    flex: 1,
  },
  contactName: {
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  contactDetails: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38BDF8',
    marginRight: 6,
  },
  liveText: {
    color: '#38BDF8',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
});

export default EmergencyContacts;
