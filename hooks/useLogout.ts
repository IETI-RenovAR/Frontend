import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export function useLogout() {
  const router = useRouter();
  const { logout: authLogout } = useAuth();

  const logout = async () => {
    try {
      console.log('Iniciando proceso de logout...');
      
      // Usar el logout del contexto para actualizar inmediatamente
      await authLogout();
      
      // Navegar a login después de actualizar el estado
      await router.replace('/(auth)/login');
      console.log('Logout completado');
    } catch (error) {
      console.error('Error durante el logout:', error);
      throw error;
    }
  };

  return { logout };
} 