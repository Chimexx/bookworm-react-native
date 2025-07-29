import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker"
import { useApi } from '@/hooks.ts/useApi';
import { Image } from "expo-image"
import { useThemeStore } from '@/store/themeStore';
import { getCreateStyles } from '@/assets/styles/create.styles';

const Create = () => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [asset, setAsset] = useState<any>();

  const router = useRouter()
  const { request, loading } = useApi();
  
  const COLORS = useThemeStore(state => state.COLORS);
  const styles = getCreateStyles(COLORS)  

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied!',
          'Sorry, we need camera roll permissions to make this work. Please enable them in your device settings.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];

        setAsset({
          uri: selectedAsset.uri,
          type: selectedAsset.type || 'image',
          fileName: selectedAsset.fileName || `image_${Date.now()}.jpg`,
          base64: selectedAsset.base64
        });
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'An error occurred while selecting image'
      );
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !caption.trim() || !rating) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (!asset?.base64) {
      Alert.alert("Error", "Please select an image to upload");
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        description: caption.trim(),
        rating,
        image: {
          base64: asset.base64,
          name: asset.fileName,
          type: asset.type
        }
      };

      await request("/books", "POST", payload);

      Alert.alert("Upload Successful", "Your book has been shared successfully!");

      setCaption("");
      setTitle("");
      setAsset(undefined);
      setRating(3);
      router.push("/");
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message ||
        error.message ||
        "Book posting failed. Please try again.";
      Alert.alert("Failed", errorMessage);
    }
  };

  const renderRatingPicker = () => {
    const stars = [] as any;

    Array.from({ length: 5 }).forEach((star,index) => {
      stars.push(
        <TouchableOpacity key={index} onPress={() => setRating(index + 1)} style={styles.starButton}>
          <Ionicons
            name={index + 1 <= rating ? "star" : "star-outline"}
            size={32}
            color={index + 1 <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      )
    })

    return <View style={styles.ratingContainer}>{stars}</View>
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>

      <ScrollView contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
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
                {asset ? (
                <Image source={{ uri: asset.uri }} style={styles.previewImage} />
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