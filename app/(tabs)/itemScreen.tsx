import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RoomScreen() {
    const { image } = useLocalSearchParams();

    const imageMap = {
        kitchen: require('../../assets/images/kitchen.png'),
        bedroom: require('../../assets/images/bedroom.png'),
        chair: require('../../assets/images/chair.png'),
        table: require('../../assets/images/table.png'),
      };

    const selectedImage = imageMap[image as keyof typeof imageMap];

    const handleBackButton = () => {
        router.push('/(tabs)/HomeScreen');
      };
    
    return (
      <View  style={styles.container}>
        {/* Sección superior */}
        <View style={styles.ButtonsSection}>
          <TouchableOpacity onPress={handleBackButton} style={styles.iconButton}>
            <Ionicons name="chevron-back-outline" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="scan-sharp" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="notebook-outline" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="tape-measure" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="move-outline" style={styles.icon} />
          </TouchableOpacity>
        </View>
  
        {/* Sección central */}
        <View style={styles.middleSection}>
            <View style={styles.middleSection}>
                <Image source={selectedImage} style={{ width: 200, height: 200 }} />
            </View>
        </View>
  
        {/* Sección inferior */}
        <View style={styles.ButtonsSection}>
          <TouchableOpacity style={styles.iconButton}>
              <Text>
                <>3D | 2D</>
              </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="bookmark" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="lightbulb-on-outline" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View >
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF6EB',
      paddingTop: 0, // Elimina espacio extra arriba
      paddingBottom: 0, // Elimina espacio extra abajo
      justifyContent: 'center',
    },
    ButtonsSection: {
      height: 50, // Más compacto
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingHorizontal: 10,
      marginVertical: 0, // Elimina separación arriba y abajo
    },
    iconButton: {
      padding: 6, // También más compacto
    },
    icon: {
      fontSize: 32,
      color: '#412f26',
    },
    middleSection: {
        height: 500, // o el valor que prefieras
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1f1f1f',
        marginHorizontal: 20,
        borderRadius: 20,
        marginVertical: 5,
    },      
  });
  
  

  
