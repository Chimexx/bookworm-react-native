import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import styles from "../../assets/styles/login.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from '@/constants/colors';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    const result = await login(email, password);

    if (result.success) {
      router.push("/")
    } else {
      Alert.alert("Error", result.error || "Something went wrong");
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <View style={styles.container}>
      <View style={styles.topIllustration}>
        <Image
          source={require("../../assets/images/chill.png")}
          style={styles.illustrationImage}
          resizeMode='contain'
        />
      </View>
      <View style={styles.card}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Enter your email'
                placeholderTextColor={COLORS.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
              />

            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Enter your password'
                placeholderTextColor={COLORS.placeholderText}
                value={password}
                onChangeText={setPassword}
                keyboardType='email-address'
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogin} disabled={isLoading} style={styles.button}>
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            )
              : (<Text style={styles.buttonText}>Login</Text>)}
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Link
            asChild
            href={{
            pathname: "/(auth)/signup"
            }}>
            <TouchableOpacity>
              <Text style={styles.link}>Signup</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  )
}

export default Login