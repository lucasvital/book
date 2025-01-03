import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Surface, Text, useTheme, IconButton, TextInput, ProgressBar, Portal, Dialog, FAB, Divider, Button } from 'react-native-paper';
import { useBooks } from '../contexts/BookContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Book, Note, NoteColor } from '../types/book';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetails'>;

const NOTE_COLORS: { [key in NoteColor]: { light: string; dark: string } } = {
  blue: { light: '#E3F2FD', dark: '#1E88E5' },
  green: { light: '#E8F5E9', dark: '#43A047' },
  purple: { light: '#F3E5F5', dark: '#8E24AA' },
  orange: { light: '#FFF3E0', dark: '#FB8C00' },
  pink: { light: '#FCE4EC', dark: '#D81B60' },
};

const BookDetailsScreen: React.FC<Props> = () => {
  const route = useRoute<Props['route']>();
  const book = route.params.book;
  const { updateBook, removeBook } = useBooks();
  const navigation = useNavigation();
  const theme = useTheme();

  const [currentPage, setCurrentPage] = React.useState(book?.currentPage?.toString() || '0');
  const [showReviewDialog, setShowReviewDialog] = React.useState(false);
  const [showNoteDialog, setShowNoteDialog] = React.useState(false);
  const [reviewText, setReviewText] = React.useState('');
  const [rating, setRating] = React.useState(0);
  const [noteText, setNoteText] = React.useState('');
  const [notePage, setNotePage] = React.useState('');
  const [selectedColor, setSelectedColor] = React.useState<NoteColor>('blue');
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  if (!book) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onBackground, fontFamily: 'Inter_400Regular' }}>Book not found</Text>
      </View>
    );
  }

  const handleUpdateProgress = () => {
    const newPage = parseInt(currentPage) || 0;
    if (newPage >= 0 && newPage <= book.totalPages) {
      const updatedBook = {
        ...book,
        currentPage: newPage,
        status: newPage === book.totalPages ? 'completed' : newPage === 0 ? 'to-read' : 'reading',
        lastUpdated: new Date().toISOString(),
      };
      updateBook(updatedBook);
      navigation.goBack();
    }
  };

  const handleAddReview = () => {
    if (reviewText.trim()) {
      const updatedBook = {
        ...book,
        review: reviewText.trim(),
        rating,
        lastUpdated: new Date().toISOString(),
      };
      updateBook(updatedBook);
      setShowReviewDialog(false);
      navigation.goBack();
    }
  };

  const handleAddNote = () => {
    const page = parseInt(notePage) || 0;
    if (noteText.trim() && page >= 0 && page <= book.totalPages) {
      const newNote: Note = {
        id: Date.now().toString(),
        text: noteText.trim(),
        page,
        color: selectedColor,
        createdAt: new Date().toISOString(),
      };

      const updatedBook = {
        ...book,
        notes: [...(book.notes || []), newNote],
        lastUpdated: new Date().toISOString(),
      };

      updateBook(updatedBook);
      setShowNoteDialog(false);
      setNoteText('');
      setNotePage('');
    }
  };

  const handleDeleteBook = async () => {
    await removeBook(book.id);
    setShowDeleteDialog(false);
    navigation.goBack();
  };

  const progress = book.totalPages > 0 
    ? Math.min(1, Math.round((book.currentPage / book.totalPages) * 100) / 100)
    : 0;

  const sortedNotes = React.useMemo(() => {
    return [...(book.notes || [])].sort((a, b) => a.page - b.page).map(note => ({
      ...note,
      color: note.color || 'blue' // Cor padrão para notas antigas
    }));
  }, [book.notes]);

  const renderColorPicker = () => {
    return (
      <View style={styles.colorPicker}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginBottom: 8, fontFamily: 'Inter_400Regular' }}>
          Choose a color:
        </Text>
        <View style={styles.colorList}>
          {(Object.keys(NOTE_COLORS) as NoteColor[]).map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setSelectedColor(color)}
              style={[
                styles.colorOption,
                { backgroundColor: NOTE_COLORS[color].light },
                selectedColor === color && styles.selectedColor,
              ]}
            >
              {selectedColor === color && (
                <IconButton
                  icon="check"
                  size={16}
                  iconColor={NOTE_COLORS[color].dark}
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderMenu = () => (
    <IconButton
      icon="dots-vertical"
      size={24}
      onPress={() => setShowDeleteDialog(true)}
      style={{ marginRight: 8 }}
    />
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderMenu(),
    });
  }, [navigation]);

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.header}>
            {book.coverImage ? (
              <Image source={{ uri: book.coverImage }} style={styles.cover} resizeMode="cover" />
            ) : (
              <View style={[styles.coverPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'Inter_400Regular' }}>No Cover</Text>
              </View>
            )}
            <View style={styles.bookInfo}>
              <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontFamily: 'Inter_700Bold' }}>
                {book.title}
              </Text>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'Inter_400Regular' }}>
                {book.author}
              </Text>
              {book.genre && (
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'Inter_400Regular' }}>
                  Genre: {book.genre}
                </Text>
              )}
              {book.publicationYear > 0 && (
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'Inter_400Regular' }}>
                  Year: {book.publicationYear}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.progressSection}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 8, fontFamily: 'Inter_600SemiBold' }}>
              Reading Progress
            </Text>
            <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
            <Text style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'Inter_400Regular' }}>
              {book.currentPage} of {book.totalPages} pages ({Math.round(progress * 100)}%)
            </Text>
            <TextInput
              mode="outlined"
              label="Current Page"
              value={currentPage}
              onChangeText={setCurrentPage}
              keyboardType="numeric"
              style={styles.pageInput}
            />
            <View style={styles.buttonContainer}>
              <IconButton
                icon="check"
                mode="contained"
                onPress={handleUpdateProgress}
                size={24}
                iconColor={theme.colors.onPrimary}
                containerColor={theme.colors.primary}
              />
            </View>
          </View>

          {sortedNotes.length > 0 && (
            <View style={styles.notesSection}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 8, fontFamily: 'Inter_600SemiBold' }}>
                Notes
              </Text>
              {sortedNotes.map((note) => (
                <Surface
                  key={note.id}
                  style={[
                    styles.noteCard,
                    { backgroundColor: NOTE_COLORS[note.color || 'blue'].light }
                  ]}
                >
                  <View style={styles.noteHeader}>
                    <View 
                      style={[
                        styles.pageTag,
                        { backgroundColor: NOTE_COLORS[note.color || 'blue'].dark }
                      ]}
                    >
                      <Text style={styles.pageTagText}>
                        Page {note.page}
                      </Text>
                    </View>
                    <Text 
                      variant="bodySmall" 
                      style={{ color: NOTE_COLORS[note.color || 'blue'].dark, fontFamily: 'Inter_400Regular' }}
                    >
                      {new Date(note.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={[styles.noteText, { color: '#000' }]}>
                    {note.text}
                  </Text>
                </Surface>
              ))}
            </View>
          )}

          {book.status === 'completed' && !book.review && (
            <View style={styles.buttonContainer}>
              <IconButton
                icon="pencil"
                mode="outlined"
                onPress={() => setShowReviewDialog(true)}
                size={24}
                iconColor={theme.colors.primary}
              />
            </View>
          )}

          {book.review && (
            <View style={styles.reviewSection}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontFamily: 'Inter_600SemiBold' }}>
                Review
              </Text>
              <Surface style={[styles.reviewCard, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'Inter_400Regular' }}>
                  {book.review}
                </Text>
              </Surface>
            </View>
          )}
        </Surface>
      </ScrollView>

      <Portal>
        <Dialog 
          visible={showNoteDialog} 
          onDismiss={() => setShowNoteDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={{ fontFamily: 'Inter_700Bold' }}>Add Note</Dialog.Title>
          <Dialog.ScrollArea style={styles.dialogScrollArea}>
            <View style={styles.dialogContent}>
              <TextInput
                mode="outlined"
                label="Page Number"
                value={notePage}
                onChangeText={setNotePage}
                keyboardType="numeric"
                style={styles.dialogInput}
              />
              {renderColorPicker()}
              <TextInput
                mode="outlined"
                label="Your thoughts..."
                value={noteText}
                onChangeText={setNoteText}
                multiline
                numberOfLines={4}
                style={styles.dialogInput}
              />
            </View>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <IconButton
              icon="close"
              onPress={() => setShowNoteDialog(false)}
              iconColor={theme.colors.error}
            />
            <IconButton
              icon="check"
              onPress={handleAddNote}
              iconColor={theme.colors.primary}
              disabled={!noteText.trim() || !notePage.trim()}
            />
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showReviewDialog} onDismiss={() => setShowReviewDialog(false)}>
          <Dialog.Title style={{ fontFamily: 'Inter_700Bold' }}>Add Review</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Review"
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={4}
              style={{ fontFamily: 'Inter_400Regular' }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <IconButton
              icon="close"
              onPress={() => setShowReviewDialog(false)}
              iconColor={theme.colors.error}
            />
            <IconButton
              icon="check"
              onPress={handleAddReview}
              iconColor={theme.colors.primary}
            />
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title style={{ fontFamily: 'Inter_700Bold' }}>Remove Book</Dialog.Title>
          <Dialog.Content>
            <Text style={{ fontFamily: 'Inter_400Regular', color: theme.colors.onSurface }}>
              Are you sure you want to remove "{book.title}" from your library?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onPress={handleDeleteBook} textColor={theme.colors.error}>Remove</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowNoteDialog(true)}
        color={theme.colors.onPrimary}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cover: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  coverPlaceholder: {
    width: 100,
    height: 150,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
  },
  progressSection: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  pageInput: {
    marginTop: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  notesSection: {
    marginTop: 24,
  },
  noteCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pageTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageTagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  noteText: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    color: '#000',
    fontFamily: 'Inter_400Regular',
  },
  reviewSection: {
    marginTop: 24,
  },
  reviewCard: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  dialog: {
    borderRadius: 28,
  },
  dialogScrollArea: {
    paddingHorizontal: 24,
  },
  dialogContent: {
    paddingVertical: 8,
  },
  dialogInput: {
    marginBottom: 16,
    fontFamily: 'Inter_400Regular',
  },
  colorPicker: {
    marginBottom: 16,
  },
  colorList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#000',
  },
  checkIcon: {
    margin: 0,
    padding: 0,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default BookDetailsScreen;
