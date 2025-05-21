import { NavigationParams } from '@/types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { JSX, useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { EventRegister } from 'react-native-event-listeners';

interface CustomItem {
    id: string;
    name: string;
    imageUri: string;
}

interface DefaultItem {
    id: string;
    name: string;
    defaultImage: any;
}

interface RenderItem {
    id: string;
    name: string;
    isCustom: boolean;
    imageUri?: string;
    defaultImage?: any;
    isAddButton?: boolean;
}

export default function HomeScreen(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'Spaces' | 'Things'>('Spaces');
  const { name, role } = useLocalSearchParams<NavigationParams>();
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  const [customSpaces, setCustomSpaces] = useState<CustomItem[]>([]);
  const [customThings, setCustomThings] = useState<CustomItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Cargar elementos personalizados al inicio
  useEffect(() => {
    const loadCustomItems = async () => {
      try {
        const spaces = await AsyncStorage.getItem('customSpaces');
        const things = await AsyncStorage.getItem('customThings');
        if (spaces) setCustomSpaces(JSON.parse(spaces));
        if (things) setCustomThings(JSON.parse(things));
      } catch (error) {
        console.error('Error loading custom items:', error);
      }
    };
    loadCustomItems();

    // Escuchar eventos de eliminación
    const deleteListener = EventRegister.addEventListener(
      'itemDeleted',
      (data: { type: string; id: string }) => {
        if (data.type === 'customSpaces') {
          setCustomSpaces(prev => prev.filter(item => item.id !== data.id));
        } else if (data.type === 'customThings') {
          setCustomThings(prev => prev.filter(item => item.id !== data.id));
        }
      }
    );

    // Limpiar listeners
    return () => {
      EventRegister.removeEventListener(deleteListener as string);
    };
  }, []);

  // Cargar imágenes personalizadas
  useEffect(() => {
    const loadCustomImages = async () => {
      try {
        const imageKeys = ['bedroom', 'kitchen', 'livingRoom', 'chair', 'table', 'shelf'];
        const loadedImages: Record<string, string> = {};
        
        for (const key of imageKeys) {
          const customImage = await AsyncStorage.getItem(`customImage-${key}`);
          if (customImage) {
            loadedImages[key] = customImage;
          }
        }
        
        setCustomImages(loadedImages);
      } catch (error) {
        console.error('Error loading custom images:', error);
      }
    };

    loadCustomImages();

    const eventListener = EventRegister.addEventListener('imageUpdated', (data: { key: string, uri: string | null }) => {
      setCustomImages(prev => {
        if (data.uri === null) {
          const newImages = { ...prev };
          delete newImages[data.key];
          return newImages;
        }
        return { ...prev, [data.key]: data.uri };
      });
    });

    return () => {
      EventRegister.removeEventListener(eventListener as string);
    };
  }, []);

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permiso requerido', 'Se necesitan permisos para acceder a la galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Hubo un error al seleccionar la imagen');
    }
  };

  const handleAddNewItem = async () => {
    if (!selectedImage || !newItemName.trim()) {
      Alert.alert('Error', 'Por favor selecciona una imagen y escribe un nombre');
      return;
    }

    try {
      const newItem: CustomItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
        imageUri: selectedImage,
      };

      if (activeTab === 'Spaces') {
        const newSpaces = [...customSpaces, newItem];
        await AsyncStorage.setItem('customSpaces', JSON.stringify(newSpaces));
        setCustomSpaces(newSpaces);
      } else {
        const newThings = [...customThings, newItem];
        await AsyncStorage.setItem('customThings', JSON.stringify(newThings));
        setCustomThings(newThings);
      }

      setIsModalVisible(false);
      setNewItemName('');
      setSelectedImage(null);
    } catch (error) {
      console.error('Error saving new item:', error);
      Alert.alert('Error', 'Hubo un error al guardar el nuevo elemento');
    }
  };

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

  const getImageSource = useCallback((key: string, defaultImage: any) => {
    return customImages[key] ? { uri: customImages[key] } : defaultImage;
  }, [customImages]);

  const renderItems = () => {
    const defaultItems: DefaultItem[] = activeTab === 'Spaces' 
      ? [
          { id: 'bedroom', name: 'Bedroom', defaultImage: require('../../assets/images/bedroom.png') },
          { id: 'kitchen', name: 'Kitchen', defaultImage: require('../../assets/images/kitchen.png') },
          { id: 'livingRoom', name: 'Living room', defaultImage: require('../../assets/images/living_room.webp') }
        ]
      : [
          { id: 'chair', name: 'Chair', defaultImage: require('../../assets/images/chair.png') },
          { id: 'table', name: 'Table', defaultImage: require('../../assets/images/table.png') },
          { id: 'shelf', name: 'Shelf', defaultImage: require('../../assets/images/shelf.webp') }
        ];

    const items = activeTab === 'Spaces' ? customSpaces : customThings;
    const allItems: RenderItem[] = [
      ...defaultItems.map(item => ({
        id: item.id,
        name: item.name,
        isCustom: false,
        defaultImage: item.defaultImage
      })),
      ...items.map(item => ({
        id: item.id,
        name: item.name,
        isCustom: true,
        imageUri: item.imageUri
      }))
    ];

    const rows = [];
    for (let i = 0; i < allItems.length; i += 2) {
      const row = allItems.slice(i, i + 2);
      
      if (i + 2 >= allItems.length) {
        let rowItems = [...row];
        if (rowItems.length < 2) {
          rowItems.push({ isAddButton: true } as RenderItem);
        } else {
          rows.push(
            <View key={`row-${i}`} style={styles.rowButtons}>
              {rowItems.map((item, index) => (
                <TouchableOpacity
                  key={item.id || `item-${index}`}
                  onPress={() => handleImageSelect(item.id)}
                  style={styles.projectButton}
                >
                  <Image
                    source={
                      item.isCustom && item.imageUri
                        ? { uri: item.imageUri }
                        : customImages[item.id]
                          ? { uri: customImages[item.id] }
                          : item.defaultImage
                    }
                    style={styles.image}
                  />
                  <Text style={styles.projectText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
          rowItems = [{ isAddButton: true } as RenderItem];
        }

        rows.push(
          <View key={`row-${i + 1}`} style={styles.rowButtons}>
            {rowItems.map((item, index) => 
              item.isAddButton ? (
                <TouchableOpacity
                  key="add-button"
                  onPress={() => setIsModalVisible(true)}
                  style={styles.projectButton}
                >
                  <Image
                    source={
                      activeTab === 'Spaces'
                        ? require('../../assets/images/add_Space2.png')
                        : require('../../assets/images/add_thing.png')
                    }
                    style={[styles.image, styles.smallImage]}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  key={item.id || `item-${index}`}
                  onPress={() => handleImageSelect(item.id)}
                  style={styles.projectButton}
                >
                  <Image
                    source={
                      item.isCustom && item.imageUri
                        ? { uri: item.imageUri }
                        : customImages[item.id]
                          ? { uri: customImages[item.id] }
                          : item.defaultImage
                    }
                    style={styles.image}
                  />
                  <Text style={styles.projectText}>{item.name}</Text>
                </TouchableOpacity>
              )
            )}
            {rowItems.length === 1 && <View style={styles.projectButton} />}
          </View>
        );
      } else {
        rows.push(
          <View key={`row-${i}`} style={styles.rowButtons}>
            {row.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleImageSelect(item.id)}
                style={styles.projectButton}
              >
                <Image
                  source={
                    item.isCustom && item.imageUri
                      ? { uri: item.imageUri }
                      : customImages[item.id]
                        ? { uri: customImages[item.id] }
                        : item.defaultImage
                  }
                  style={styles.image}
                />
                <Text style={styles.projectText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
            {row.length === 1 && <View style={styles.projectButton} />}
          </View>
        );
      }
    }

    if (allItems.length === 0) {
      rows.push(
        <View key="empty-row" style={styles.rowButtons}>
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={styles.projectButton}
          >
            <Image
              source={
                activeTab === 'Spaces'
                  ? require('../../assets/images/add_Space2.png')
                  : require('../../assets/images/add_thing.png')
              }
              style={[styles.image, styles.smallImage]}
            />
          </TouchableOpacity>
          <View style={styles.projectButton} />
        </View>
      );
    }

    return rows;
  };

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

      {/* Content */}
      <View style={styles.projectContainer}>
        {renderItems()}
      </View>

      {/* Modal para agregar nuevo item */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Agregar nuevo {activeTab === 'Spaces' ? 'espacio' : 'objeto'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={newItemName}
              onChangeText={setNewItemName}
            />

            <TouchableOpacity 
              style={styles.imagePickerButton}
              onPress={handleImagePicker}
            >
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              ) : (
                <Text style={styles.imagePickerText}>Seleccionar imagen</Text>
              )}
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsModalVisible(false);
                  setNewItemName('');
                  setSelectedImage(null);
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddNewItem}
              >
                <Text style={styles.buttonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    height: 200,
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
    width: '45%',
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
  smallImage: {
    width: 60,
    height: 60,
    marginTop: 20,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    minHeight: 140,
  },
  addButtonRow: {
    justifyContent: 'center',
    minHeight: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF4E9',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B3425',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#4B3425',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  imagePickerButton: {
    width: 150,
    height: 150,
    borderColor: '#4B3425',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  imagePickerText: {
    color: '#4B3425',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#8B7355',
  },
  addButton: {
    backgroundColor: '#4B3425',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  }
})