import { View } from 'react-native'
import React from 'react'
import { IBook } from '@/interface/book.interface';
import COLORS from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import styles from "@/assets/styles/profile.styles";

const Rating = ({ book }: { book: IBook }) => {
  return (
    <View style={styles.ratingContainer}>
      {Array.from({ length: 5 }).map((_, index) => {
        const rated = index + 1 <= Number(book.rating);
        return (
          <Ionicons
            key={index}
            name={rated ? "star" : "star-outline"}
            size={18}
            color={rated ? "#f4b400" : COLORS.textSecondary}
          />
        );
      })}
    </View>
  )
}

export default Rating