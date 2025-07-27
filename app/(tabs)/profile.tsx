import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import useBooks from '@/hooks.ts/useBooks';
import { useAuthStore } from '@/store/authStore';
import ProfileHeader from '../components/ProfileHeader';
import LogoutButton from '../components/LogoutButton';
import { IBook } from '@/interface/book.interface';
import styles from '@/assets/styles/profile.styles';
import COLORS from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useApi } from '@/hooks.ts/useApi';
import ProfileBook from '../components/Book';

const Profile = () => {
  const router = useRouter();
  const { logOut } = useAuthStore();
  const [progress, setProgress] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState<IBook | null>(null);

  const {
    books,
    refreshing,
    loading,
    hasMore,
    loadBooks,
  } = useBooks();

  const { request } = useApi();
  
  const refreshBooks = useCallback(() => {
    loadBooks({ pageToLoad: 1, isRefresh: true, subRoute: "/user" });
  }, []);

  const fetchNextPage = useCallback(() => {
    if (hasMore) {
      loadBooks({ pageToLoad: books.length / 2 + 1, subRoute: "/user" });
    }
  }, [hasMore, books.length, loadBooks]);

  useEffect(() => {
    refreshBooks();
  }, [refreshBooks]);

  const handleDeleteBook = async(id: string) => {
    try {
      setProgress(true)
      const response = await request(
        `/books/${id}`,
        "DELETE"
      );

      if (response) {
        Alert.alert("Success", "Book deleted successfully");
        refreshBooks();
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setProgress(false)
    }
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton logout={logOut} />

      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Your Recommendations</Text>
        <Text style={styles.booksCount}>{books.length} books</Text>
      </View>

      <FlatList
        data={books}
        renderItem={({ item }) =>
          <ProfileBook
            progress={progress}
            selectedBook={selectedBook}
            book={item as IBook}
            handleDeleteBook={handleDeleteBook}
            setSelectedBook={setSelectedBook}
          />}
        keyExtractor={(item) => (item as IBook)._id}
        contentContainerStyle={styles.booksList}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshBooks}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListFooterComponent={
          hasMore && loading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={{ marginVertical: 20 }}
            />
          ) : null
        }
        ListEmptyComponent={
          !loading && !refreshing && books.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="book-outline"
                size={60}
                color={COLORS.textSecondary}
              />
              <Text style={styles.emptyText}>No recommendations yet.</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/create')}
              >
                <Text style={styles.addButtonText}>Add Your First Book</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Profile;
