import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Surface, Text, TextInput, useTheme, Portal, Dialog, Button } from 'react-native-paper';
import { useBooks } from '../contexts/BookContext';
import { searchBooks } from '../services/googleBooks';
import { useNavigation } from '@react-navigation/native';
import { Book } from '../types/book';

const AddBookScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [manualBook, setManualBook] = useState({
    title: '',
    author: '',
    totalPages: '',
    genre: '',
    publicationYear: '',
  });
  const { addBook } = useBooks();
  const navigation = useNavigation();
  const theme = useTheme();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setSearchResults([]);
    
    try {
      console.log('Starting search for:', searchQuery);
      const results = await searchBooks(searchQuery);
      console.log('Search results:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching books:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBook = (book: Book) => {
    addBook(book);
    navigation.goBack();
  };

  const handleAddManualBook = () => {
    const newBook: Book = {
      id: Date.now().toString(),
      title: manualBook.title,
      author: manualBook.author,
      genre: manualBook.genre,
      publicationYear: parseInt(manualBook.publicationYear) || 0,
      totalPages: parseInt(manualBook.totalPages) || 0,
      currentPage: 0,
      status: 'to-read',
      notes: [],
      lastUpdated: new Date().toISOString(),
    };
    
    addBook(newBook);
    setShowManualDialog(false);
    navigation.goBack();
  };

  const renderBookItem = ({ item: book }: { item: Book }) => (
    <View style={styles.bookCardContainer}>
      <Surface style={[styles.bookCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.bookContent}>
          {book.coverImage ? (
            <Image 
              source={{ uri: book.coverImage }} 
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.coverPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>No Cover</Text>
            </View>
          )}
          <View style={styles.bookInfo}>
            <Text 
              variant="titleMedium" 
              style={[styles.title, { color: theme.colors.onSurface }]}
              numberOfLines={2}
            >
              {book.title}
            </Text>
            <Text 
              variant="bodyMedium" 
              style={[styles.author, { color: theme.colors.onSurfaceVariant }]}
              numberOfLines={1}
            >
              {book.author}
            </Text>
            {book.totalPages > 0 && (
              <Text 
                variant="bodySmall" 
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Pages: {book.totalPages}
              </Text>
            )}
            {book.genre !== 'Unknown Genre' && (
              <Text 
                variant="bodySmall" 
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Genre: {book.genre}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => handleAddBook(book)}
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={{ color: theme.colors.onPrimary }}>Add</Text>
          </TouchableOpacity>
        </View>
      </Surface>
    </View>
  );

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          label="Search books"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          right={
            <TextInput.Icon 
              icon="magnify" 
              onPress={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
            />
          }
          style={styles.searchInput}
        />
        <TouchableOpacity
          onPress={() => setShowManualDialog(true)}
          style={[styles.manualButton, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={{ color: theme.colors.onPrimary }}>Add Manually</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ color: theme.colors.onSurface, marginTop: 8 }}>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            searchQuery.trim() !== '' ? (
              <View style={styles.centerContent}>
                <Text style={{ color: theme.colors.onSurface }}>No books found</Text>
              </View>
            ) : null
          }
        />
      )}

      <Portal>
        <Dialog visible={showManualDialog} onDismiss={() => setShowManualDialog(false)}>
          <Dialog.Title>Add Book Manually</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Title"
              value={manualBook.title}
              onChangeText={(text) => setManualBook({ ...manualBook, title: text })}
              style={styles.dialogInput}
            />
            <TextInput
              mode="outlined"
              label="Author"
              value={manualBook.author}
              onChangeText={(text) => setManualBook({ ...manualBook, author: text })}
              style={styles.dialogInput}
            />
            <TextInput
              mode="outlined"
              label="Genre"
              value={manualBook.genre}
              onChangeText={(text) => setManualBook({ ...manualBook, genre: text })}
              style={styles.dialogInput}
            />
            <TextInput
              mode="outlined"
              label="Publication Year"
              value={manualBook.publicationYear}
              onChangeText={(text) => setManualBook({ ...manualBook, publicationYear: text })}
              keyboardType="numeric"
              style={styles.dialogInput}
            />
            <TextInput
              mode="outlined"
              label="Total Pages"
              value={manualBook.totalPages}
              onChangeText={(text) => setManualBook({ ...manualBook, totalPages: text })}
              keyboardType="numeric"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowManualDialog(false)}>Cancel</Button>
            <Button 
              onPress={handleAddManualBook}
              disabled={!manualBook.title || !manualBook.author}
            >
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    marginBottom: 8,
  },
  manualButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  bookCardContainer: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookCard: {
    borderRadius: 8,
  },
  bookContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  coverImage: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 12,
  },
  coverPlaceholder: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookInfo: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    marginBottom: 4,
  },
  author: {
    marginBottom: 4,
  },
  addButton: {
    padding: 8,
    borderRadius: 4,
    minWidth: 64,
    alignItems: 'center',
  },
  dialogInput: {
    marginBottom: 8,
  },
});

export default AddBookScreen;
