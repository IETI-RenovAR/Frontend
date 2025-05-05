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
      })

      if (!response.ok) {
        throw new Error('Error al iniciar sesión');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError('Error al iniciar sesión');
      console.error(err);
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
