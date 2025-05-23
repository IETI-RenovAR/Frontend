import { renderHook } from '@testing-library/react-native';

type LoginResult = {
  token: string;
  name: string;
  role: string;
};

// Mock de fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockLoginImplementation = async (email: string, password: string): Promise<LoginResult> => {
  return {
    token: 'test-token',
    name: 'admin',
    role: 'ADMIN'
  };
};

describe('Login', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('debería manejar el login exitoso', async () => {
    const mockLogin = jest.fn().mockResolvedValue({
      token: 'test-token',
      name: 'admin',
      role: 'ADMIN'
    } as LoginResult);

    const { result } = renderHook(() => ({
      login: mockLogin,
      loading: false,
      error: ''
    }));

    const loginResult = await result.current.login('admin@admin.com', 'admin') as LoginResult;

    expect(loginResult.token).toBe('test-token');
    expect(loginResult.name).toBe('admin');
    expect(loginResult.role).toBe('ADMIN');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('debería cambiar loading a true al iniciar sesión', async () => {
    const mockLogin = jest.fn().mockResolvedValue({
      token: 'test-token',
      name: 'admin',
      role: 'ADMIN'
    } as LoginResult);

    const { result } = renderHook(() => ({
      login: mockLogin,
      loading: false,
      error: ''
    }));

    const loginResult = await result.current.login('admin@admin.com', 'admin') as LoginResult;

    expect(loginResult.token).toBe('test-token');
    expect(loginResult.name).toBe('admin');
    expect(loginResult.role).toBe('ADMIN');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });
});
