import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import styles from "../../assets/styles/signup.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';


const Signup = () => {
   const [userName, setUserName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { isLoading, register } = useAuthStore();

  const handleSignup = async () => {
    const result = await register(userName, email, password);

    if (result.success) {
      router.push("/(auth)");
    } else {
      Alert.alert("Error", result.error || "Something went wrong");
    }
  }
  
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>BookWorm</Text>
            <Text style={styles.subtitle}>Share your favorite reads</Text>
          </View>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Enter your username'
                placeholderTextColor={COLORS.placeholderText}
                value={userName}
                  onChangeText={setUserName}
                autoCapitalize='none'
              />

            </View>
          </View>
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
          <TouchableOpacity onPress={handleSignup} disabled={isLoading} style={styles.button}>
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            )
              : (<Text style={styles.buttonText}>Signup</Text>)}
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={()=> router.back()}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  )
}

export default Signup