import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

// Define un hook personalizado para proteger las rutas
export function useProtectedRoute(isAuthenticated: boolean | null) {
    const segments = useSegments();
    const router = useRouter();
  
    useEffect(() => {
      console.log('Estado de autenticación:', isAuthenticated);
      console.log('Segmento actual:', segments[0]);
  
      if (isAuthenticated === null) {
        // Aún cargando, no hacer nada
        return;
      }
  
      const inAuthGroup = segments[0] === '(auth)';
  
      if (!isAuthenticated && !inAuthGroup) {
        console.log('Redirigiendo a login...');
        router.replace('/(auth)/login');
      } else if (isAuthenticated && inAuthGroup) {
        console.log('Redirigiendo a home...');
        router.replace('/(tabs)/HomeScreen');
      }
    }, [isAuthenticated, segments, router]);
  }
  