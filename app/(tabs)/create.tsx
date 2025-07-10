import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import styles from '@/assets/styles/create.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import { useAuthStore } from '@/store/authStore';
import { BASE_URL } from '@/constants/api';

const Create = () => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter()
  const {token} = useAuthStore()

  const pickImage = async () => {
    try {
      //Request permission from user
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied, allow permission to enable us upload an image.")
        }
      }

      //Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, //quality, 1 means original quality
        base64: true
      })
      
      if (!result.canceled) {
        setImage(result.assets[0].uri);

        if(result.assets[0].base64) {
          setImageBase64(result.assets[0].base64)
        } else {
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64
          })
        }
      }
    } catch (error) {
      Alert.alert("An error occured while lauching image picker")
    }
  }

  const handleSubmit = async() => {
    if(!title || !caption || !image || !rating) {
      Alert.alert("Error", "All fields are required")
      return;
    }

    //Get file extension
    const uriParts = image.split(".");
    const fileType = uriParts[uriParts.length - 1];
    const imageType = fileType ? `${fileType.toLowerCase()}` : "image/jpeg";
    const imageDataUrl = `${imageType};base64,${imageBase64}`;

    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/books`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            title,
            caption,
            rating: rating.toString(),
            image: imageDataUrl
          }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to post book");
      }

      Alert.alert("Success", "Book posted successfully");
      
      setCaption("");
      setTitle("");
      setImage("");
      setRating(3);
      setImageBase64("")
      
      router.push("/");
    } catch (error) {
      console.log(error)
      throw new Error("Error:", (error as any)?.message || "Failed to post book");
    } finally {
      setLoading(false);
    }

  }

  const renderRatingPicker = () => {
    const stars = [] as any;

    Array.from({ length: 5 }).forEach((star,index) => {
      stars.push(
        <TouchableOpacity key={index} onPress={() => setRating(index)} style={styles.starButton}>
          <Ionicons
            name={index <= rating ? "star" : "star-outline"}
            size={32}
            color={index <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      )
    })

    return <View style={styles.ratingContainer}>{stars}</View>
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>Share your favorite reads with others</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name='book-outline'
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Enter Book title'
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>
              {renderRatingPicker()}
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
                ): (
                  <View style={styles.placeholderContainer}>
                    <Ionicons name="image-outline" size={60} color={COLORS.textSecondary} />
                    <Text style={styles.placeholderText}>Tap to select image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View>
              <Text style={styles.label}>Caption</Text>
              <TextInput
                style={styles.textArea}
                placeholder='Write your review or thoughts about this book'
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>

            <TouchableOpacity style={styles.button} disabled={loading} onPress={handleSubmit}>
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                  <>
                    <Ionicons
                      name="cloud-upload-outline"
                      size={20}
                      color={COLORS.white}
                      style={styles.buttonIcon}
                    />
                  <Text style={styles.buttonText}>Share</Text>
                  </>
              )}

            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

    </KeyboardAvoidingView>
  )
}

export default Create