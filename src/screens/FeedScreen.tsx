import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, Avatar, useTheme, Chip, Surface, Divider } from 'react-native-paper';
import { useBooks } from '../contexts/BookContext';

const FeedScreen = () => {
  const { books } = useBooks();
  const theme = useTheme();

  const feedItems = books
    .map(book => {
      const items = [];
      
      // Add progress updates
      if (book.currentPage > 0) {
        items.push({
          type: 'progress',
          book,
          date: book.lastUpdated,
          progress: (book.currentPage / book.totalPages) * 100,
        });
      }

      // Add reviews
      if (book.review) {
        items.push({
          type: 'review',
          book,
          date: book.review.date,
          review: book.review,
        });
      }

      // Add notes
      book.notes.forEach(note => {
        items.push({
          type: 'note',
          book,
          date: book.lastUpdated,
          note,
        });
      });

      return items;
    })
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const renderFeedItem = (item: any) => {
    switch (item.type) {
      case 'progress':
        return (
          <Card style={[styles.card, { borderColor: theme.colors.outline }]} key={`${item.book.id}-${item.date}-progress`}>
            <Card.Content>
              <View style={styles.header}>
                <Avatar.Image
                  source={{ uri: item.book.coverImage }}
                  size={40}
                />
                <View style={styles.headerText}>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>{item.book.title}</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Updated reading progress • {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.content}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  Made progress: {Math.round(item.progress)}% complete
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Page {item.book.currentPage} of {item.book.totalPages}
                </Text>
              </View>
            </Card.Content>
          </Card>
        );

      case 'review':
        return (
          <Card style={[styles.card, { borderColor: theme.colors.outline }]} key={`${item.book.id}-${item.date}-review`}>
            <Card.Content>
              <View style={styles.header}>
                <Avatar.Image
                  source={{ uri: item.book.coverImage }}
                  size={40}
                />
                <View style={styles.headerText}>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>{item.book.title}</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Added a review • {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.content}>
                <View style={styles.rating}>
                  {[...Array(5)].map((_, index) => (
                    <Text
                      key={index}
                      style={{
                        color: index < item.review.rating ? theme.colors.primary : theme.colors.outline,
                      }}
                    >
                      ★
                    </Text>
                  ))}
                </View>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{item.review.text}</Text>
              </View>
            </Card.Content>
          </Card>
        );

      case 'note':
        return (
          <Card style={[styles.card, { borderColor: theme.colors.outline }]} key={`${item.book.id}-${item.date}-note`}>
            <Card.Content>
              <View style={styles.header}>
                <Avatar.Image
                  source={{ uri: item.book.coverImage }}
                  size={40}
                />
                <View style={styles.headerText}>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>{item.book.title}</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Added a note • {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.content}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{item.note}</Text>
              </View>
            </Card.Content>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.container}>
        {feedItems.map(item => renderFeedItem(item))}
      </ScrollView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  content: {
    marginLeft: 52,
  },
  rating: {
    flexDirection: 'row',
    marginBottom: 8,
  },
});

export default FeedScreen;
