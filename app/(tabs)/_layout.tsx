import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '@/constants/colors'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import SafeScreen from '../components/SafeScreen'

const TabLayout = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Tabs screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          headerShadowVisible: false,
          headerTitleStyle: {
            color: COLORS.textPrimary,
            fontWeight: 600
          },

          tabBarStyle: {
            backgroundColor: COLORS.cardBackground,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 5,
          }
        }}>
          <Tabs.Screen options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (<Ionicons name="home-outline" size={size} color={color} />)
          }}
            name='index' />
          <Tabs.Screen options={{
            title: "Create",
            tabBarIcon: ({ color, size }) => (<Ionicons name="add-circle-outline" size={size} color={color} />)
          }}
            name='create' />
          <Tabs.Screen options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (<Ionicons name="person-outline" size={size} color={color} />)
          }}
            name='profile' />
        </Tabs>
      </SafeScreen>
    </SafeAreaProvider>
  )
}

export default TabLayout