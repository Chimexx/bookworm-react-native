import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React from 'react';
import { getProfileStyles } from '@/assets/styles/profile.styles';
import { IBook } from '@/interface/book.interface';
import { Image } from 'expo-image';
import dayjs from 'dayjs';
import Rating from './Rating';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '@/store/themeStore';

interface BookProps {
  book: IBook;
  selectedBook: IBook | null;
  handleDeleteBook: (id: string) => void;
  setSelectedBook: (book: IBook) => void;
  progress: boolean
}

const ProfileBook: React.FC<BookProps> = (
  { book,selectedBook, progress, handleDeleteBook, setSelectedBook }) => {
  const date = dayjs(book.createdAt);

  const COLORS = useThemeStore(state => state.COLORS);
  const styles = getProfileStyles(COLORS)
  
  const confirmDelete = (book: IBook) => {
    setSelectedBook(book);

    Alert.alert(
      "Delete Book",
      `Are you sure you want to delete ${book.title}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            handleDeleteBook(book._id);
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  }


  return (
    <View style={styles.bookItem}>
      <Image source={{ uri: book.image }} style={styles.bookImage} contentFit="cover" />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Rating book={book} />
        <Text style={styles.bookCaption} numberOfLines={2}>{book.description}</Text>
        <Text style={styles.bookDate}>Shared on {date.format("Do MMM, YYYY")}</Text>
      </View>
      <TouchableOpacity onPress={() => confirmDelete(book)} style={styles.deleteButton}>
        {progress && selectedBook?._id === book._id ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginVertical: 20 }}
          />
        ) : (
          <Ionicons name="trash-outline" size={24} color="red" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ProfileBook