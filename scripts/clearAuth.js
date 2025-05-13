const AsyncStorage = require('@react-native-async-storage/async-storage').default;

async function clearAuth() {
  try {
    await AsyncStorage.multiRemove(['userToken', 'tokenExpirationDate']);
    console.log('Estado de autenticación limpiado correctamente');
  } catch (error) {
    console.error('Error al limpiar el estado de autenticación:', error);
  }
}

clearAuth(); 