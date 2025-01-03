import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Book } from '../types/book';

interface BookCardProps {
  book: Book;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to-read':
        return theme.colors.statusToRead;
      case 'reading':
        return theme.colors.statusReading;
      case 'completed':
        return theme.colors.statusCompleted;
      default:
        return theme.colors.outline;
    }
  };

  const progress = book.totalPages > 0 ? book.currentPage / book.totalPages : 0;

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.elevation.level2,
          borderColor: theme.colors.outline,
          borderWidth: 1,
        }
      ]}
      onPress={() => navigation.navigate('BookDetails', { book })}
    >
      <View style={styles.content}>
        {book.coverImage ? (
          <View style={styles.cover}>
            <Image 
              source={{ uri: book.coverImage }} 
              style={styles.coverImage}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.cover}>
            <View style={[styles.coverImage, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>No Cover</Text>
            </View>
          </View>
        )}

        <View style={styles.info}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {book.title}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {book.author}
          </Text>
          
          <View style={styles.statusContainer}>
            <View 
              style={[
                styles.statusIndicator, 
                { backgroundColor: getStatusColor(book.status) }
              ]} 
            />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
            </Text>
          </View>

          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Progress: {Math.round(progress * 100)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 12,
  },
  cover: {
    width: 80,
    height: 120,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
});

export default BookCard;
