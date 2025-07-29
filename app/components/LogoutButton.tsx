import { Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { getProfileStyles } from '@/assets/styles/profile.styles'
import { useThemeStore } from '@/store/themeStore';

const LogoutButton = ({ logout }: { logout: () => void }) => {
  const COLORS = useThemeStore(state => state.COLORS);
  const styles = getProfileStyles(COLORS)
  
  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Logout",
        onPress: () => {
          logout();
        },
        style: "destructive"
      }
    ], {
      cancelable: true
    })
  }
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  )
}

export default LogoutButton