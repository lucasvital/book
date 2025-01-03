import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Surface, Text, useTheme, Button, TextInput, ProgressBar, Portal, Dialog } from 'react-native-paper';
import { useBooks } from '../contexts/BookContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Book } from '../types/book';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetails'>;

const BookDetailsScreen: React.FC<Props> = () => {
  const route = useRoute<Props['route']>();
  const book = route.params.book;
  const { updateBook } = useBooks();
  const navigation = useNavigation();
  const theme = useTheme();

  const [currentPage, setCurrentPage] = React.useState(book?.currentPage?.toString() || '0');
  const [showReviewDialog, setShowReviewDialog] = React.useState(false);
  const [reviewText, setReviewText] = React.useState('');
  const [rating, setRating] = React.useState(0);

  if (!book) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onBackground }}>Book not found</Text>
      </View>
    );
  }

  const progress = book.totalPages > 0 ? book.currentPage / book.totalPages : 0;

  const handleUpdateProgress = () => {
    const newPage = parseInt(currentPage);
    if (!isNaN(newPage) && newPage >= 0 && newPage <= book.totalPages) {
      updateBook(book.id, {
        ...book,
        currentPage: newPage,
        status: newPage === book.totalPages ? 'completed' : newPage === 0 ? 'to-read' : 'reading',
      });
    }
  };

  const handleAddReview = () => {
    if (rating > 0 && reviewText.trim()) {
      updateBook(book.id, {
        ...book,
        review: {
          rating,
          text: reviewText.trim(),
          date: new Date().toISOString(),
        },
      });
      setShowReviewDialog(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.header}>
          {book.coverImage ? (
            <Image source={{ uri: book.coverImage }} style={styles.cover} resizeMode="cover" />
          ) : (
            <View style={[styles.cover, { backgroundColor: theme.colors.surfaceVariant }]} />
          )}
          <View style={styles.bookInfo}>
            <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
              {book.title}
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              {book.author}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
            Reading Progress
          </Text>
          <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
          <Text style={{ color: theme.colors.onSurfaceVariant }}>
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
          <Button
            mode="contained"
            onPress={handleUpdateProgress}
            style={styles.button}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
          >
            Update Progress
          </Button>
        </View>

        {book.notes && book.notes.length > 0 && (
          <View style={styles.notesSection}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Notes
            </Text>
            {book.notes.map((note, index) => (
              <Surface
                key={index}
                style={[styles.noteCard, { backgroundColor: theme.colors.surfaceVariant }]}
              >
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  {note}
                </Text>
              </Surface>
            ))}
          </View>
        )}

        {book.status === 'completed' && !book.review && (
          <Button
            mode="outlined"
            onPress={() => setShowReviewDialog(true)}
            style={styles.reviewButton}
          >
            Add Review
          </Button>
        )}

        {book.review && (
          <View style={styles.reviewSection}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Review
            </Text>
            <Surface style={[styles.reviewCard, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                Rating: {book.review.rating}/5
              </Text>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                {book.review.text}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Reviewed on {new Date(book.review.date).toLocaleDateString()}
              </Text>
            </Surface>
          </View>
        )}
      </Surface>

      <Portal>
        <Dialog visible={showReviewDialog} onDismiss={() => setShowReviewDialog(false)}>
          <Dialog.Title>Add Review</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Rating (1-5)"
              value={rating.toString()}
              onChangeText={(value) => setRating(parseInt(value) || 0)}
              keyboardType="numeric"
              style={{ marginBottom: 16 }}
            />
            <TextInput
              mode="outlined"
              label="Review"
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={4}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setShowReviewDialog(false)}
              textColor={theme.colors.primary}
            >
              Cancel
            </Button>
            <Button 
              onPress={handleAddReview}
              textColor={theme.colors.primary}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
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
  button: {
    marginTop: 8,
  },
  notesSection: {
    marginTop: 24,
  },
  noteCard: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  reviewButton: {
    marginTop: 24,
  },
  reviewSection: {
    marginTop: 24,
  },
  reviewCard: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
});

export default BookDetailsScreen;
