import { useState } from 'react';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const usersURL = 'http://20.83.172.95:8080/v1';

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(usersURL + '/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('Error en la respuesta del servidor:', response.statusText);
        console.log('Datos del error:', data);
        setError(data.message || 'Error al iniciar sesión');
        return null;
      }

      // Asegurarse de que la respuesta tenga el formato esperado
      if (!data.token || !data.expirationDate) {
        setError('Respuesta del servidor inválida');
        return null;
      }

      return {
        token: data.token,
        expirationDate: data.expirationDate
      };
    } catch (err: any) {
      console.error('Error completo:', err);
      setError('Error de conexión con el servidor');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { 
    login, 
    loading, 
    error 
  };
}
