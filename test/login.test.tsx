jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import LoginPage from '../app/(auth)/login';

// Mock useRouter
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const mockHandleLogin = jest.fn();

jest.mock('../hooks/useLogin', () => ({
  __esModule: true,
  useLogin: () => ({
    loading: false,
    login: mockHandleLogin,
    error: null,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mockHandleLogin.mockClear();
  });

  it('debería renderizar los campos de login', () => {
    const { getByPlaceholderText } = render(<LoginPage />);
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
  });

  it('debería llamar a handleLogin al presionar el botón', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginPage />);

    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'usuario@test.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), '1234');
    fireEvent.press(getByText('Log in'));

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith('usuario@test.com', '1234');
    });
  });
});
