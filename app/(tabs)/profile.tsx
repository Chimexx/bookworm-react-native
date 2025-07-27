import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

import useBooks from '@/hooks.ts/useBooks';
import { useAuthStore } from '@/store/authStore';
import ProfileHeader from '../components/ProfileHeader';
import LogoutButton from '../components/LogoutButton';
import { Book } from '.';
import { IBook } from '@/interface/book.interface';
import styles from '@/assets/styles/profile.styles';
import COLORS from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

const Profile = () => {
  const router = useRouter();
  const { logOut } = useAuthStore();

  const {
    books,
    refreshing,
    loading,
    hasMore,
    loadBooks,
  } = useBooks();

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
        renderItem={({ item }) => <Book book={item as IBook} />}
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
