import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Switch, Text } from 'react-native-paper';
import { useTheme } from '../contexts/ThemeContext';

const SettingsScreen = () => {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader 
          style={{ 
            color: theme.colors.onSurfaceVariant,
            fontFamily: 'Inter_600SemiBold'
          }}
        >
          Appearance
        </List.Subheader>
        
        <List.Item
          title="Dark Mode"
          description="Use dark theme"
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => (
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              color={theme.colors.primary}
            />
          )}
          titleStyle={{ 
            color: theme.colors.onSurface,
            fontFamily: 'Inter_500Medium'
          }}
          descriptionStyle={{ 
            color: theme.colors.onSurfaceVariant,
            fontFamily: 'Inter_400Regular'
          }}
        />
      </List.Section>

      <View style={styles.aboutSection}>
        <Text 
          variant="titleMedium" 
          style={{ 
            color: theme.colors.onSurface,
            fontFamily: 'Inter_600SemiBold',
            marginBottom: 8
          }}
        >
          About
        </Text>
        <Text 
          variant="bodyMedium" 
          style={{ 
            color: theme.colors.onSurfaceVariant,
            fontFamily: 'Inter_400Regular'
          }}
        >
          BookTracker v1.0.0
        </Text>
        <Text 
          variant="bodySmall" 
          style={{ 
            color: theme.colors.onSurfaceVariant,
            fontFamily: 'Inter_400Regular',
            marginTop: 4
          }}
        >
          A simple app to track your reading progress
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  aboutSection: {
    marginTop: 32,
    padding: 16,
  },
});

export default SettingsScreen;
