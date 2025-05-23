// Configuración del entorno para pruebas
process.env.EXPO_OS = 'web';

// Mock de expo-image
jest.mock('expo-image', () => {
  const { View } = require('react-native');
  return {
    Image: View,
  };
});

// Silenciar warnings específicos
jest.spyOn(console, 'warn').mockImplementation((message) => {
  if (message.includes('process.env.EXPO_OS')) {
    return;
  }
  console.warn(message);
}); 