import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView} from 'react-native';
import { useLogin } from '../../hooks/useLogin';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useLogin();

  const handleLogin = async () => {
    const result = await login(email, password);  
    if (result) {
      console.log('JWT:', result);
      try {
        await AsyncStorage.setItem('userToken', result.token);
        await AsyncStorage.setItem('tokenExpirationDate', result.expirationDate);
        router.push('/(tabs)/home');
      } catch (error) {
        console.error("Error al guardar el token", error);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>LOG IN</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>YOUR EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#333"
        />

        <View style={styles.passwordRow}>
          <Text style={styles.label}>PASSWORD</Text>
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder=""
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#333"
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Log in'}</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or sign up with social account</Text>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>📘 Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>✉️ Gmail</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fdf5ec',
    padding: 20,
    alignItems: 'center',
    paddingTop: 80,
  },
  header: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#4c2a1c',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    color: '#4c2a1c',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#4c2a1c',
    marginBottom: 20,
    fontSize: 14,
    paddingVertical: 8,
    color: '#333',
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 12,
    color: '#4c2a1c',
  },
  button: {
    backgroundColor: '#4c2a1c',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 25,
    color: '#444',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  socialText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
