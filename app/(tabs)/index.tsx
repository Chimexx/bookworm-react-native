import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import styles from '@/assets/styles/home.styles';
import { IBook } from '@/interface/book.interface';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';
import dayjs from 'dayjs';
import { useBooks } from '@/hooks.ts/useBooks';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useAuthStore } from '@/store/authStore';

dayjs.extend(advancedFormat);

const Home = () => {

  const { logOut } = useAuthStore();

  const { books, refreshing, loading, hasMore, refreshBooks, fetchNextPage, loadBooks } = useBooks();
  
  useEffect(() => {
    loadBooks({ pageToLoad: 1, isRefresh: true }); // initial load
  }, []);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={logOut}>
        <Text>
          Logout
        </Text>
      </TouchableOpacity>
      <FlatList
        data={books}
        renderItem={({ item }) => <Book book={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchNextPage}
        // onRefresh={refreshBooks}
        // refreshing={refreshing}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BookWorm</Text>
            <Text style={styles.headerSubtitle}>Discover exciting reads from the community</Text>
          </View>
        }
        ListFooterComponent={
          hasMore && books.length> 0 ? <ActivityIndicator size="large" color={COLORS.primary} /> : null}
        ListEmptyComponent={
          refreshing && books.length === 0 ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ):
          (<View style={styles.emptyContainer}>
            <Ionicons
              name={"book-outline"}
              size={60}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendations yet.</Text>
            <Text style={styles.emptySubtext}>Be the first to share a book</Text>
          </View>)
        }
      />
    </View>
  )
}

export default Home

export const Book = ({ book }: { book: IBook }) => {

  const date = dayjs(book.createdAt)
  return (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: book.user.profileImage }} style={styles.avatar} />
          <Text style={styles.username}>{book.user.userName}</Text>
        </View>
      </View>
      <View style={styles.bookImageContainer}>
        <Image source={{ uri: book.image }} style={styles.bookImage} contentFit="cover" />
      </View>
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{book.title}</Text>

        <View style={styles.ratingContainer}>
          {Array.from({ length: 5 }).map((_, index) => {
            const rated = index + 1 <= Number(book.rating);
            return (<Ionicons
              key={index}
              name={rated ? "star" : "star-outline"}
              size={18}
              color={rated ? "#f4b400" : COLORS.textSecondary}
            />
            )
          })}
        </View>

        <Text style={styles.caption}>{book.description}</Text>
        <Text style={styles.date}>Shared on {date.format("Do MMM, YYYY")}</Text>
      </View>

    </View>
  )
}