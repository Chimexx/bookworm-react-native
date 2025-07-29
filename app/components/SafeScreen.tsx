import { View, StyleSheet } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useThemeStore } from '@/store/themeStore';

const SafeScreen = ({ children }: any) => {
  const insets = useSafeAreaInsets();
  const { COLORS } = useThemeStore();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: COLORS.background }]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default SafeScreen