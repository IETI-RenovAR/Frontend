import { useState } from 'react';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const usersURL = 'http://20.83.172.95:8080/v1';

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError('');
    
    try {
      // Validaciones básicas
      if (!username || !email || !password) {
        throw new Error('Todos los campos son requeridos');
      }

      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const response = await fetch(usersURL + '/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.message) {
          throw new Error(errorData.message);
        }
        throw new Error(`Error al registrar usuario (${response.status})`);
      }

      // Después del registro exitoso, hacer login automático para obtener el token
      const loginResponse = await fetch(usersURL + '/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      if (!loginResponse.ok) {
        throw new Error('Registro exitoso pero error al iniciar sesión automáticamente');
      }
      const loginData = await loginResponse.json();
      return {
        ...loginData,
        token: loginData.token,
        expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al registrar usuario';
      setError(errorMessage);
      console.error('Error en registro:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { 
    register, 
    loading, 
    error 
  };
}
