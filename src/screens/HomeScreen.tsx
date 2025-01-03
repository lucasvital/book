import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Surface, Text, IconButton, Searchbar } from 'react-native-paper';
import { useBooks } from '../contexts/BookContext';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useTheme } from '../contexts/ThemeContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

const HomeScreen = () => {
  const { books, removeBook, updateBook } = useBooks();
  const navigation = useNavigation();
  const { theme } = useTheme();
  let row: Array<any> = [];
  let prevOpenedRow: any;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || book.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleBookPress = (book) => {
    navigation.navigate('BookDetails', { book });
  };

  const handleCompleteBook = async (book) => {
    const updatedBook = {
      ...book,
      currentPage: book.totalPages,
      status: 'completed',
      lastUpdated: new Date().toISOString(),
    };
    await updateBook(updatedBook);
  };

  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const renderLeftActions = (progress, dragX, book) => {
    return (
      <View style={[styles.leftAction, { backgroundColor: theme.colors.primary }]}>
        <IconButton icon="check" iconColor="#fff" size={24} />
        <Text style={styles.actionText}>Complete</Text>
      </View>
    );
  };

  const renderRightActions = (progress, dragX, book) => {
    return (
      <View style={[styles.rightAction, { backgroundColor: theme.colors.error }]}>
        <IconButton icon="delete" iconColor="#fff" size={24} />
        <Text style={styles.actionText}>Delete</Text>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    const progress = item.totalPages > 0 
      ? Math.min(1, Math.round((item.currentPage / item.totalPages) * 100) / 100)
      : 0;

    return (
      <Swipeable
        ref={ref => row[index] = ref}
        renderLeftActions={(progress, dragX) => renderLeftActions(progress, dragX, item)}
        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
        onSwipeableOpen={() => closeRow(index)}
        onSwipeableLeftOpen={() => handleCompleteBook(item)}
        onSwipeableRightOpen={() => removeBook(item.id)}
      >
        <Surface style={[styles.bookCard, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity onPress={() => handleBookPress(item)}>
            <View style={styles.bookContent}>
              {item.coverImage ? (
                <Image source={{ uri: item.coverImage }} style={styles.cover} resizeMode="cover" />
              ) : (
                <View style={[styles.coverPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <Text style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'Inter_400Regular' }}>
                    No Cover
                  </Text>
                </View>
              )}
              <View style={styles.bookInfo}>
                <Text 
                  variant="titleMedium" 
                  style={{ color: theme.colors.onSurface, marginBottom: 4, fontFamily: 'Inter_600SemiBold' }}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text 
                  variant="bodyMedium" 
                  style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'Inter_400Regular' }}
                  numberOfLines={1}
                >
                  {item.author}
                </Text>
                <View style={styles.progressContainer}>
                  <Text 
                    variant="bodySmall" 
                    style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'Inter_400Regular' }}
                  >
                    {Math.round(progress * 100)}% completed
                  </Text>
                  <Text 
                    variant="bodySmall" 
                    style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'Inter_400Regular' }}
                  >
                    Page {item.currentPage} of {item.totalPages}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Surface>
      </Swipeable>
    );
  };

  const FilterButton = ({ status, label }: { status: 'all' | 'to-read' | 'reading' | 'completed', label: string }) => (
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.colors.background, padding: 16 }]}>
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
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  bookCard: {
    borderRadius: 12,
    elevation: 2,
    marginBottom: 16,
  },
  bookContent: {
    flexDirection: 'row',
    padding: 16,
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  coverPlaceholder: {
    width: 80,
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  progressContainer: {
    marginTop: 8,
  },
  leftAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  rightAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    marginHorizontal: 8,
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
});

export default HomeScreen;
