import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useBooks } from '../contexts/BookContext';
import { useTheme } from '../contexts/ThemeContext';

const FeedScreen = () => {
  const { books } = useBooks();
  const { theme } = useTheme();

  // Obtém todas as notas de todos os livros e as ordena por data
  const allNotes = books
    .reduce((notes, book) => {
      const bookNotes = (book.notes || []).map(note => ({
        ...note,
        bookTitle: book.title,
        bookAuthor: book.author,
      }));
      return [...notes, ...bookNotes];
    }, [])
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {allNotes.map((note) => (
        <Card 
          key={note.id} 
          style={[
            styles.card, 
            { 
              backgroundColor: theme.colors.surface,
              marginBottom: 16 
            }
          ]}
        >
          <Card.Content>
            <View style={styles.noteHeader}>
              <Text 
                variant="titleMedium" 
                style={{ 
                  color: theme.colors.primary,
                  fontFamily: 'Inter_600SemiBold',
                  marginBottom: 4
                }}
              >
                {note.bookTitle}
              </Text>
              <Text 
                variant="bodySmall" 
                style={{ 
                  color: theme.colors.onSurfaceVariant,
                  fontFamily: 'Inter_400Regular'
                }}
              >
                by {note.bookAuthor}
              </Text>
            </View>
            <View 
              style={[
                styles.pageTag, 
                { backgroundColor: theme.colors.primaryContainer }
              ]}
            >
              <Text 
                style={{ 
                  color: theme.colors.onPrimaryContainer,
                  fontFamily: 'Inter_500Medium'
                }}
              >
                Page {note.page}
              </Text>
            </View>
            <Text 
              style={{ 
                marginTop: 12,
                color: theme.colors.onSurface,
                fontFamily: 'Inter_400Regular',
                lineHeight: 20
              }}
            >
              {note.text}
            </Text>
            <Text 
              variant="bodySmall" 
              style={{ 
                marginTop: 12,
                color: theme.colors.onSurfaceVariant,
                fontFamily: 'Inter_400Regular'
              }}
            >
              {new Date(note.createdAt).toLocaleDateString()}
            </Text>
          </Card.Content>
        </Card>
      ))}
      {allNotes.length === 0 && (
        <View style={styles.emptyState}>
          <Text 
            variant="bodyLarge" 
            style={{ 
              color: theme.colors.onSurfaceVariant,
              fontFamily: 'Inter_400Regular',
              textAlign: 'center'
            }}
          >
            No notes yet. Add notes to your books to see them here!
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    elevation: 2,
  },
  noteHeader: {
    marginBottom: 8,
  },
  pageTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});

export default FeedScreen;
