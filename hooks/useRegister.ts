import { useState } from 'react';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const usersURL = 'http://20.83.172.95:8080/v1';

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError('');
    // Toca desbloquear el endpoint en el repositorio de users y eliminar lastname del DTO
    try {
      const response = await fetch(usersURL + '/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: name, email: email, password: password })
      })

      if (!response.ok) {
        throw new Error('Error al registar usuario');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError('Error al registar usuario');
      console.error(err);
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
