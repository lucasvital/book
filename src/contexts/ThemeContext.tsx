import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

// Crie um tema personalizado estendendo o tema base do Paper
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200EE',
    primaryContainer: '#E8D5FF',
    onPrimaryContainer: '#6200EE',
    secondary: '#03DAC6',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    onSurface: '#000000',
    onSurfaceVariant: '#1F1F1F',
    outline: '#CCCCCC',
    error: '#B00020',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    elevation: {
      level0: 'transparent',
      level1: '#F5F5F5',
      level2: '#EEEEEE',
      level3: '#E0E0E0',
      level4: '#DBDBDB',
      level5: '#D6D6D6',
    },
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#6200EE',
    primaryContainer: '#4B00B5',
    onPrimaryContainer: '#F2DAFF',
    secondary: '#03DAC6',
    background: '#121212',
    surface: '#121212',
    surfaceVariant: '#2C2C2C',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#E1E1E1',
    outline: '#444444',
    error: '#CF6679',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    elevation: {
      level0: 'transparent',
      level1: '#1E1E1E',
      level2: '#222222',
      level3: '#242424',
      level4: '#272727',
      level5: '#2C2C2C',
    },
  },
};

type Theme = typeof lightTheme;

interface ThemeContextData {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

type ThemeProviderProps = {
  children: React.ReactNode | ((props: ThemeContextData) => React.ReactNode);
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const contextValue = { theme, isDarkMode, toggleTheme };

  return (
    <ThemeContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </ThemeContext.Provider>
  );
};
