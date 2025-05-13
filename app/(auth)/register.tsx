
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRegister } from '../../hooks/useRegister';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { register, loading, error } = useRegister();

  useEffect(() => {
    // Limpiar los campos cuando se monta el componente
    setEmail('');
    setUsername('');
    setPassword('');
  }, []);

  const handleRegister = async () => {
    const result = await register(username, email, password);
    if (result) {
      try {
        setShowSuccessModal(true);
      } catch (error) {
        console.error("Error al guardar el token", error);
      }
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.containerWrapper}>
      {/* Modal de éxito personalizado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Success</Text>
            <Text style={styles.modalMessage}>User registered successfully!</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleSuccessModalClose}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Fondo general */}
      <View style={styles.background} />

      {/* Mancha gráfica debajo del texto, ubicada a la derecha */}
      <Image
        source={require('@/assets/images/login-background2.png')}
        style={styles.textureImage}
        contentFit="contain"
      />

      {/* SIGN UP con estilos divididos */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          <Text style={styles.signText}>SIGN </Text>
          <Text style={styles.upText}> UP</Text>
        </Text>
      </View>

      {/* Contenido del formulario con márgenes aumentados */}
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>YOUR EMAIL</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>NAME</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="words"
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />

            <View style={styles.passwordFieldWrapper}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign up'}</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>Or sign up with social account</Text>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require('@/assets/images/facebook-icon.png')}
                  style={styles.socialIcon}
                  contentFit="contain"
                />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require('@/assets/images/google-icon.png')}
                  style={styles.googleIcon}
                  contentFit="contain"
                />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.termsText}>
              By signing up you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Use</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  textureImage: {
    position: 'absolute',
    width: width * 0.8,
    height: height * 0.18,
    top: height * 0.08,
    right: -width * 0.25, // Mantenida a la derecha
    zIndex: 1,
    opacity: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: height * 0.14,
    left:160,
    zIndex: 2,
  },
  signText: {
    color: '#4c2a1c', // Color café para "SIGN"
  },
  upText: {
    color: '#fff7ec', // Color crema para "UP"
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: height * 0.28,
    paddingBottom: 40,
  },
  contentWrapper: {
    backgroundColor: 'transparent',
  },
  header: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#4c2a1c',
    fontFamily: 'Nunito-Bold',
    letterSpacing: 1,
    textAlign: 'left',
  },
  formContainer: {
    width: '80%',
    marginTop: 10,
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  label: {
    fontSize: 12,
    color: '#4c2a1c',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontFamily: 'Nunito',
    letterSpacing: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#4c2a1c',
    marginBottom: 20,
    fontSize: 14,
    paddingVertical: 2,
    color: '#333',
    fontFamily: 'Nunito',
    height: 40,
    backgroundColor: 'transparent',
    width: '100%',
  },
  passwordFieldWrapper: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#4c2a1c',
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 2,
    color: '#333',
    fontFamily: 'Nunito',
    height: 40,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#8a715d',
    paddingVertical: 5,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    height: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Nunito-Bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Nunito',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 30,
    fontSize: 13,
    color: '#444',
    fontFamily: 'Nunito',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4c2a1c',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '45%',
    marginHorizontal: 5,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  googleIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  socialText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4c2a1c',
    fontFamily: 'Nunito',
  },
  termsText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#444',
    fontFamily: 'Nunito',
    marginTop: 50,
  },
  termsLink: {
    color: '#4c2a1c',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff7ec',
    padding: 25,
    borderRadius: 20,
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
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#412f26',
    fontFamily: 'Nunito-Bold',
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 25,
    color: '#412f26',
    fontFamily: 'Nunito',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#412f26',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '60%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalButtonText: {
    color: '#fff7ec',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Nunito-Bold',
  },
});