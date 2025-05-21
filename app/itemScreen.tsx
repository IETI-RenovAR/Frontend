import { NavigationParams } from '@/types/navigation';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';

interface CustomItem {
    id: string;
    name: string;
    imageUri: string;
}

export default function RoomScreen() {
    const { image, name } = useLocalSearchParams<NavigationParams>();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [customItem, setCustomItem] = useState<CustomItem | null>(null);
    const [itemType, setItemType] = useState<'customSpaces' | 'customThings'>('customSpaces');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const imageMap = {
        kitchen: require('../assets/images/kitchen.png'),
        bedroom: require('../assets/images/bedroom.png'),
        livingRoom: require('../assets/images/living_room.webp'),
        chair: require('../assets/images/chair.png'),
        table: require('../assets/images/table.png'),
        shelf: require('../assets/images/shelf.webp'),
    };

    const defaultImage = imageMap[image as keyof typeof imageMap];

    useEffect(() => {
        const loadImages = async () => {
            try {
                // Intentar cargar imagen personalizada para items predefinidos
                const customImage = await AsyncStorage.getItem(`customImage-${image}`);
                if (customImage) {
                    setSelectedImage(customImage);
                    return;
                }

                // Determinar si es un espacio o una cosa basado en el ID
                const spaceIds = ['bedroom', 'kitchen', 'livingRoom'];
                const thingIds = ['chair', 'table', 'shelf'];
                
                if (spaceIds.includes(image as string)) {
                    setItemType('customSpaces');
                } else if (thingIds.includes(image as string)) {
                    setItemType('customThings');
                }

                // Si no es una imagen predefinida, buscar en los items personalizados
                const spaces = await AsyncStorage.getItem('customSpaces');
                const things = await AsyncStorage.getItem('customThings');
                const allItems = [
                    ...(spaces ? JSON.parse(spaces) : []),
                    ...(things ? JSON.parse(things) : [])
                ];

                const item = allItems.find(item => item.id === image);
                if (item) {
                    setCustomItem(item);
                    setSelectedImage(item.imageUri);
                    // Determinar el tipo basado en dónde se encontró el item
                    const spacesArray = spaces ? JSON.parse(spaces) : [];
                    setItemType(spacesArray.some((i: CustomItem) => i.id === item.id) ? 'customSpaces' : 'customThings');
                }
            } catch (error) {
                console.error('Error loading images:', error);
            }
        };

        loadImages();
    }, [image]);

    const handleImagePicker = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (permissionResult.granted === false) {
                alert('Se necesitan permisos para acceder a la galería');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                const newImageUri = result.assets[0].uri;
                
                if (customItem) {
                    // Actualizar item personalizado
                    const updatedItem = { ...customItem, imageUri: newImageUri };
                    const items = await AsyncStorage.getItem(itemType);
                    const parsedItems = items ? JSON.parse(items) : [];
                    const updatedItems = parsedItems.map((item: CustomItem) => 
                        item.id === customItem.id ? updatedItem : item
                    );
                    await AsyncStorage.setItem(itemType, JSON.stringify(updatedItems));
                    setCustomItem(updatedItem);
                } else {
                    // Actualizar imagen predefinida
                    await AsyncStorage.setItem(`customImage-${image}`, newImageUri);
                    EventRegister.emit('imageUpdated', { key: image, uri: newImageUri });
                }
                
                setSelectedImage(newImageUri);
            }
        } catch (error) {
            console.error('Error picking or saving image:', error);
            alert('Hubo un error al seleccionar la imagen');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            if (customItem) {
                // Eliminar item personalizado
                const items = await AsyncStorage.getItem(itemType);
                const parsedItems = items ? JSON.parse(items) : [];
                const updatedItems = parsedItems.filter((item: CustomItem) => item.id !== customItem.id);
                await AsyncStorage.setItem(itemType, JSON.stringify(updatedItems));
                
                // Notificar al HomeScreen sobre la eliminación
                EventRegister.emit('itemDeleted', { 
                    type: itemType,
                    id: customItem.id 
                });

                // Redirigir al home
                router.push({ 
                    pathname: '/(tabs)/HomeScreen',
                    params: { name } 
                });
            } else {
                // Eliminar imagen personalizada de item predefinido
                await AsyncStorage.removeItem(`customImage-${image}`);
                setSelectedImage(null);
                EventRegister.emit('imageUpdated', { key: image, uri: null });
            }
            setIsDeleteModalVisible(false);
        } catch (error) {
            console.error('Error deleting item:', error);
            Alert.alert(
                "Error",
                "Hubo un error al eliminar el elemento. Por favor, intenta de nuevo."
            );
        }
    };

    const handleDeleteImage = () => {
        setIsDeleteModalVisible(true);
    };

    const handleBackButton = useCallback(() => {
        router.push({ 
            pathname: '/(tabs)/HomeScreen', 
            params: { name } 
        });
    }, [name]);

    const handleScanButton = useCallback(() => {
        router.push({
            pathname: '/scannerScreen',
            params: { name, image }
        });
    }, [name, image]);

    return (
        <View style={styles.container}>
            {/* Sección superior */}
            <View style={styles.ButtonsSection}>
                <TouchableOpacity onPress={handleBackButton} style={styles.iconButton}>
                    <Ionicons name="chevron-back-outline" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleScanButton} style={styles.iconButton}>
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
                <Image 
                    source={selectedImage ? { uri: selectedImage } : defaultImage} 
                    style={styles.itemImage} 
                />
            </View>

            {/* Sección inferior */}
            <View style={styles.ButtonsSection}>
                <TouchableOpacity style={[styles.iconButton, styles.dimensionButton]}>
                    <Text style={styles.dimensionText}>3D | 2D</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Feather name="bookmark" size={32} color="#412f26" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialCommunityIcons name="lightbulb-on-outline" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleImagePicker} style={styles.iconButton}>
                    <Feather name="upload" size={32} color="#412f26" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteImage} style={styles.iconButton}>
                    <Feather name="trash" size={32} color="#412f26" />
                </TouchableOpacity>
            </View>

            {/* Modal de confirmación de eliminación */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isDeleteModalVisible}
                onRequestClose={() => setIsDeleteModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Feather name="alert-triangle" size={50} color="#4B3425" />
                        </View>
                        
                        <Text style={styles.modalTitle}>Confirmar Eliminación</Text>
                        
                        <Text style={styles.modalMessage}>
                            {customItem 
                                ? `¿Estás seguro de que deseas eliminar ${customItem.name}?`
                                : "¿Estás seguro de que deseas eliminar la imagen personalizada?"
                            }
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setIsDeleteModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.modalButton, styles.deleteButton]}
                                onPress={handleDeleteConfirm}
                            >
                                <Text style={[styles.buttonText, styles.deleteButtonText]}>Eliminar</Text>
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
        backgroundColor: '#FFF6EB',
        paddingTop: 0,
        paddingBottom: 0,
        justifyContent: 'center',
    },
    ButtonsSection: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    iconButton: {
        padding: 6,
    },
    icon: {
        fontSize: 32,
        color: '#412f26',
    },
    middleSection: {
        height: 500,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1f1f1f',
        marginHorizontal: 20,
        borderRadius: 20,
        marginVertical: 5,
    },
    itemImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFF6EB',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4B3425',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        minWidth: '45%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#8B7355',
    },
    deleteButton: {
        backgroundColor: '#FF6B6B',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButtonText: {
        color: '#FFF',
    },
    dimensionButton: {
        marginRight: -15,
        marginLeft: 10,
    },
    dimensionText: {
        fontSize: 18,
        color: '#412f26',
        fontWeight: '500',
    },
});
  
  

  
