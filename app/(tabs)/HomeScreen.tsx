import { NavigationParams } from '@/types/navigation';
import { router, useLocalSearchParams } from 'expo-router';
import React, { JSX, useCallback, useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function HomeScreen(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'Spaces' | 'Things'>('Spaces');
  const { name } = useLocalSearchParams<NavigationParams>();

  // Función para capitalizar la primera letra
  const formatName = useCallback((name: string | null | undefined): string => {
    if (!name) return 'User';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }, []);

  const handleImageSelect = useCallback((imageKey: string) => {
    router.push({ 
      pathname: '../itemScreen', 
      params: { 
        image: imageKey,
        name 
      } 
    });
  }, [name]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning, {formatName(name)}!</Text>
        <Text style={styles.subGreeting}>what do you want to do today?</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab('Spaces')}>
          <Text style={[styles.tabText, activeTab === 'Spaces' ? styles.activeTab : styles.inactiveTab]}>
            Spaces
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Things')}>
          <Text style={[styles.tabText, activeTab === 'Things' ? styles.activeTab : styles.inactiveTab]}>
            Things
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content by Tab */}
      <View style={styles.projectContainer}>
        {activeTab === 'Spaces' ? (
          <>
            <TouchableOpacity onPress={() => handleImageSelect('bedroom')} style={styles.projectButton}>
              <Image
                source={require('../../assets/images/bedroom.png')}
                style={styles.image}
              />
              <Text style={styles.projectText}>Bedroom</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleImageSelect('kitchen')} style={styles.projectButton}>
              <Image
                source={require('../../assets/images/kitchen.png')}
                style={styles.image}
              />
              <Text style={styles.projectText}>Kitchen</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => handleImageSelect('chair')} style={styles.projectButton}>
              <Image
                source={require('../../assets/images/chair.png')}
                style={styles.image}
              />
              <Text style={styles.projectText}>Chair</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleImageSelect('table')} style={styles.projectButton}>
              <Image
                source={require('../../assets/images/table.png')}
                style={styles.image}
              />
              <Text style={styles.projectText}>Table</Text>
            </TouchableOpacity>
          </>
        )}
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
    padding: 30,
    paddingTop: 60,
    height:200,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingTop: 25,
  },
  subGreeting: {
    fontSize: 16,
    color: '#dddddd',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    marginBottom: 10,
  },
  tabText: {
    fontSize: 18,
    paddingBottom: 4,
  },
  activeTab: {
    color: '#6B4B3A',
    borderBottomColor: '#6B4B3A',
    borderBottomWidth: 2,
  },
  inactiveTab: {
    color: '#aaaaaa',
  },
  projectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  projectButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  projectText: {
    marginTop: 8,
    fontSize: 16,
    color: '#3C3C3C',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
