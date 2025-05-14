import { NavigationParams } from '@/types/navigation';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useLogout } from '../../hooks/useLogout';

export default function ProfileScreen() {
  const { logout } = useLogout();
  const router = useRouter();
  const { name } = useLocalSearchParams<NavigationParams>();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const formatName = useCallback((name: string | null | undefined): string => {
    if (!name) return 'User';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.profileImageContainer}>
          <Image 
            source={require('../../assets/images/user.png')}
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* Profile Info Section */}
      <View style={styles.profileInfoSection}>
        <Text style={styles.userName}>{formatName(name)}</Text>
        <Text style={styles.location}>Bogotá</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Content</Text>
        <View style={styles.sectionContent}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="folder" size={24} color="#412f26" />
              <Text style={styles.menuItemText}>Saved</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={14} color="#412f26" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Octicons name="download" size={24} color="#412f26" />
              <Text style={styles.menuItemText}>Downloads</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={14} color="#412f26" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, styles.preferencesTitle]}>Preferences</Text>
        <View style={styles.sectionContent}>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <FontAwesome name="moon-o" size={24} color="#412f26" />
              <Text style={styles.menuItemText}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#412f26', true: '#4B3425' }}
              thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={[styles.menuItem, { paddingTop: 5 }]}>
            <View style={styles.menuItemLeft}>
              <Entypo name="inbox" size={24} color="#412f26" />
              <Text style={styles.menuItemText}>Suscription</Text>
              <Text style={styles.freeText}>Free</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={14} color="#412f26" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="white" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
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
    paddingTop: 50,
    alignItems: 'center',
    height: 150,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff7ec',
    marginBottom: 0,
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileInfoSection: {
    alignItems: 'center',
    marginTop: 60,
  },
  userName: {
    fontSize: 24,
    color: '#412f26',
    marginBottom: -4,
  },
  location: {
    fontSize: 16,
    color: '#8a715d',
    marginBottom: 11,
  },
  editButton: {
    borderWidth: 1.3,
    borderColor: '#a4703f',
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  editButtonText: {
    color: '#a4703f',
    fontSize: 16,
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8a715d',
    marginBottom: 8,
    backgroundColor: '#efe5d8',
    paddingVertical: 7,
    paddingHorizontal: 20,
  },
  sectionContent: {
    paddingHorizontal: 35,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333333',
  },
  freeText: {
    color: '#8a715d',
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: '#412f26',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 110,
    marginHorizontal: 135,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  preferencesTitle: {
    marginBottom: 4,
  },
}); 