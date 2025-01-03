import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { BookProvider } from './src/contexts/BookContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { View } from 'react-native';

const ThemedApp = () => {
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <PaperProvider theme={theme}>
        <BookProvider>
          <AppNavigator />
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        </BookProvider>
      </PaperProvider>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
