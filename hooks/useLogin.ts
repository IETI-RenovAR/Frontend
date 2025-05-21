import { useState } from 'react';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const usersURL = 'http://20.83.172.95:8080/v1';

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      // Primer paso: Login
      const loginResponse = await fetch(usersURL + '/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
      });

      // Primero verificamos si la respuesta es ok antes de intentar parsear el JSON
      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        console.log('Error en la respuesta del servidor:', loginResponse.statusText);
        console.log('Datos del error:', errorText);
        setError('Error al iniciar sesión');
        return null;
      }

      const loginData = await loginResponse.json();

      // Asegurarse de que la respuesta tenga el formato esperado
      if (!loginData.token) {
        setError('Respuesta del servidor inválida');
        return null;
      }

      // Segundo paso: Obtener información del usuario
      const userResponse = await fetch(usersURL + '/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });

      let username = email.split('@')[0]; // valor por defecto
      let userRole = "USER"; // valor por defecto
      if (userResponse.ok) {
        const userData = await userResponse.json();
        // Buscamos el usuario que coincida con el email
        const user = userData.find((user: any) => user.email === email);
        if (user && user.username) {
          username = user.username;
          userRole = Array.isArray(user.roles) && user.roles.length > 0 ? user.roles[0] : "USER";
        }
      }

      // Si no hay expirationDate en la respuesta, creamos una que expire en 24 horas
      const expirationDate = loginData.expirationDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      return {
        token: loginData.token,
        expirationDate: expirationDate,
        name: username,
        role: userRole
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
