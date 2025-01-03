import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Switch, useTheme, Surface, Text } from 'react-native-paper';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';

const SettingsScreen = () => {
  const { themeType, setThemeType, isDarkMode } = useAppTheme();
  const theme = useTheme();

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader style={{ color: theme.colors.onBackground }}>
          Appearance
        </List.Subheader>
        
        <Surface style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
          <List.Item
            title="Dark Mode"
            description="Use dark theme"
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            titleStyle={{ color: theme.colors.onSurface }}
            left={props => (
              <List.Icon 
                {...props} 
                icon="theme-light-dark"
                color={theme.colors.primary}
              />
            )}
            right={() => (
              <Switch
                value={isDarkMode}
                onValueChange={() => 
                  setThemeType(isDarkMode ? 'light' : 'dark')
                }
                color={theme.colors.primary}
              />
            )}
          />
          
          <View style={styles.divider} />
          
          <List.Item
            title="Use System Theme"
            description="Automatically switch theme based on system settings"
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            titleStyle={{ color: theme.colors.onSurface }}
            left={props => (
              <List.Icon 
                {...props} 
                icon="cog" 
                color={theme.colors.primary}
              />
            )}
            right={() => (
              <Switch
                value={themeType === 'system'}
                onValueChange={(value) => 
                  setThemeType(value ? 'system' : isDarkMode ? 'dark' : 'light')
                }
                color={theme.colors.primary}
              />
            )}
          />
        </Surface>
      </List.Section>

      <List.Section>
        <List.Subheader style={{ color: theme.colors.onBackground }}>
          About
        </List.Subheader>
        
        <Surface style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
          <List.Item
            title="Version"
            description="1.0.0"
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            titleStyle={{ color: theme.colors.onSurface }}
            left={props => (
              <List.Icon 
                {...props} 
                icon="information" 
                color={theme.colors.primary}
              />
            )}
          />
        </Surface>
      </List.Section>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    elevation: 2,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    opacity: 0.1,
    backgroundColor: '#000',
  },
});

export default SettingsScreen;
