import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "./components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeStore } from "@/store/themeStore";
import { IColor } from "@/constants/colors";

export default function RootLayout () {
  const rootNavigation = useRootNavigationState();

  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token, isAuthChecked } = useAuthStore()
  const { setColors } = useThemeStore()

  useEffect(() => {
    const setAppColor = async() => {
      try {
        const colors = await AsyncStorage.getItem("COLORS");
        if (colors) {
          const colorsParsed = JSON.parse(colors) as IColor 
          setColors(colorsParsed);
        }
      } catch (error) {
        console.log(error)
      }
    }

    setAppColor()
  },[])
  
  useEffect(() => {
    checkAuth()
  }, [segments])

  useEffect(() => {
    if (!rootNavigation?.key || !isAuthChecked || segments.length < 1) return;

    const isAuthScreen = segments[0] === "(auth)";
    const isLoggedIn = Boolean(token) && user;

    if (!isAuthScreen && !isLoggedIn) {
      router.replace("/(auth)" as any);
    } else if (isAuthScreen && isLoggedIn) {
      router.replace("/(tabs)" as any);
    }
  }, [segments, user, token, rootNavigation, isAuthChecked]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false, headerTitleAlign: "center" }}>
          <Stack.Screen name="(tabs)"/>
          <Stack.Screen name="(auth)"/>
        </Stack>
      </SafeScreen>
      <StatusBar style="dark"/>
    </SafeAreaProvider>
  )
}
