import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, Searchbar, useTheme } from 'react-native-paper';
import { useBooks } from '../contexts/BookContext';
import BookCard from '../components/BookCard';
import { Book } from '../types/book';
import { useNavigation } from '@react-navigation/native';

type BookStatus = 'all' | 'to-read' | 'reading' | 'completed';

const HomeScreen = () => {
  const { books } = useBooks();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BookStatus>('all');
  const theme = useTheme();

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || book.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleBookPress = (book: Book) => {
    navigation.navigate('BookDetails', { book });
  };

  const renderBookCard = ({ item }: { item: Book }) => (
    <TouchableOpacity onPress={() => handleBookPress(item)}>
      <BookCard book={item} />
    </TouchableOpacity>
  );

  const FilterButton = ({ status, label }: { status: BookStatus, label: string }) => (
    <TouchableOpacity
      onPress={() => setSelectedStatus(status)}
      style={[
        styles.filterButton,
        {
          backgroundColor: selectedStatus === status ? theme.colors.primaryContainer : 'transparent',
          borderColor: selectedStatus === status ? theme.colors.primary : theme.colors.outline,
          borderWidth: 1,
        }
      ]}
    >
      <Text
        style={[
          styles.filterButtonText,
          {
            color: selectedStatus === status ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant
          }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search books..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[
          styles.searchBar,
          { 
            backgroundColor: theme.colors.elevation.level1,
            borderColor: theme.colors.outline,
            borderWidth: 1,
          }
        ]}
        iconColor={theme.colors.onSurfaceVariant}
        inputStyle={{ color: theme.colors.onSurface }}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />
      
      <View style={styles.filterContainer}>
        <FilterButton status="all" label="All" />
        <FilterButton status="to-read" label="To Read" />
        <FilterButton status="reading" label="Reading" />
        <FilterButton status="completed" label="Completed" />
      </View>

      <FlatList
        data={filteredBooks}
        renderItem={renderBookCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.bookList}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 0,
    borderRadius: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterButton: {
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bookList: {
    paddingBottom: 16,
  },
});

export default HomeScreen;
