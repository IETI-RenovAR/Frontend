import { NavigationParams } from '@/types/navigation';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function AdminScreen() {
  const { name } = useLocalSearchParams<NavigationParams>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hi, Admin</Text>
        <Text style={styles.subTitle}>User Statistics</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../assets/images/adminPage.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E9',
  },
  header: {
    backgroundColor: '#4B3425',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 70,
    paddingBottom: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff7ec',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 18,
    color: '#fff7ec',
    opacity: 0.9,
  },
  imageContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  }
}); 