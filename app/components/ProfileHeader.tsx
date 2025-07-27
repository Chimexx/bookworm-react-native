import { View, Text } from 'react-native'
import React from 'react'
import { useAuthStore } from '@/store/authStore'
import styles from '@/assets/styles/profile.styles';
import { Image } from 'expo-image';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

const ProfileHeader = () => {
  const { user } = useAuthStore();
  const date = dayjs(user?.createdAt)

  return (
    <View style={styles.profileHeader}>
      <Image source={{ uri: user?.profileImage }} style={styles.profileImage} />

      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user?.userName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.memberSince}>Joined {date.format("Do MMM, YYYY")}</Text>
      </View>
    </View>
  )
}

export default ProfileHeader