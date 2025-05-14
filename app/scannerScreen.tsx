import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ScannerScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.containerWrapper}>
      {/* Fondo general */}
      <View style={styles.background} />

      {/* Imagen de fondo del scanner */}
      <Image
        source={require('@/assets/images/scanner.png')}
        style={styles.backgroundImage}
        contentFit="cover"
      />

      {/* Botón de retroceso */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Image
          source={require('@/assets/images/flecha.png')}
          style={styles.backIcon}
          contentFit="contain"
        />
      </TouchableOpacity>

      {/* Contenedor para el texto y botón de escaneo */}
      <View style={styles.bottomContainer}>
        <Text style={styles.instructionText}>Place your objects inside the box</Text>
        <TouchableOpacity style={styles.scanButton}>
          <Text style={styles.scanButtonText}>SCAN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff7ec',
    zIndex: 0,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 2,
    padding: 10,
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  instructionText: {
    color: '#412f26',
    fontSize: 18,
    fontFamily: 'Nunito',
    marginBottom: 20,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#412f26',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scanButtonText: {
    color: '#fff7ec',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Nunito-Bold',
  },
}); 