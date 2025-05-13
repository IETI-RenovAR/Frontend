import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean | null;
  login: (token: string, expirationDate: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Verificar estado de autenticación al inicio
  useEffect(() => {
    checkToken();
    
    // Verificar cada 5 segundos como respaldo (puede ser más tiempo)
    const checkTokenInterval = setInterval(checkToken, 5000);
    return () => clearInterval(checkTokenInterval);
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const expirationDate = await AsyncStorage.getItem('tokenExpirationDate');
      
      if (!token || !expirationDate) {
        setIsAuthenticated(false);
        return;
      }

      const hasExpired = new Date(expirationDate) < new Date();
      
      if (hasExpired) {
        await AsyncStorage.multiRemove(['userToken', 'tokenExpirationDate']);
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking token:', error);
      setIsAuthenticated(false);
    }
  };

  // Función para login que actualiza el estado inmediatamente
  const login = async (token: string, expirationDate: string) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('tokenExpirationDate', expirationDate);
      setIsAuthenticated(true);
      console.log('Token guardado y estado actualizado correctamente');
    } catch (error) {
      console.error('Error durante login:', error);
      throw error;
    }
  };

  // Función para logout que actualiza el estado inmediatamente
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'tokenExpirationDate']);
      setIsAuthenticated(false);
      console.log('Token removido y estado actualizado correctamente');
    } catch (error) {
      console.error('Error durante logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 