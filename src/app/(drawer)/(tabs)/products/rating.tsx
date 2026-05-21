import React, { useState, useCallback, Fragment } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  useColorScheme,
  Alert,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

import { useAppContext } from '@/context/app-context';
import { createStyles } from '@/styles';
import { RatingImage, MockUploadResponse } from '@/types';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function StarRating({
  value,
  onChange,
  isDark,
}: {
  value: number;
  onChange: (v: number) => void;
  isDark: boolean;
}) {
  const accentColor = isDark ? '#818cf8' : '#6366f1';
  const emptyColor = isDark ? '#334155' : '#d4dce6';
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange(star)}>
          <Text style={{ fontSize: 36, color: star <= value ? accentColor : emptyColor }}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ImageGrid({
  images,
  onRemove,
  onImagePress,
  isDark,
}: {
  images: RatingImage[];
  onRemove: (index: number) => void;
  onImagePress: (index: number) => void;
  isDark: boolean;
}) {
  const size = (Dimensions.get('window').width - 32 - 8 * 2) / 3;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {images.map((img, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onImagePress(index)}
          style={{ width: size, height: size, borderRadius: 8, overflow: 'hidden' }}>
          <Image source={{ uri: img.uri }} style={{ width: size, height: size }} contentFit="cover" />
          {img.uploading && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'rgba(0,0,0,0.4)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
          {img.error && (
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(220,38,38,0.8)',
                padding: 2,
              }}>
              <Text style={{ color: '#fff', fontSize: 10, textAlign: 'center' }}>Failed</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: 10,
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>✕</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const starLabels: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export default function RatingScreen() {
  const navigation = useNavigation();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { products, addRating, updateRating } = useAppContext();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const styles = createStyles(isDark);

  const product = products.find((p) => p.id === productId);

  const [stars, setStars] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState<RatingImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const ensureCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission Required',
        'Please go to Settings and grant camera access to take photos for your review.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const ensureGalleryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Gallery Permission Required',
        'Please go to Settings and grant photo library access to upload images for your review.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const compressImage = async (uri: string): Promise<string> => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1024 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  };

  const getFileSize = async (uri: string): Promise<number> => {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      return (info as any).size ?? 0;
    } catch {
      return 0;
    }
  };

  const handleTakePhoto = useCallback(async () => {
    if (images.length >= 5) {
      Alert.alert('Limit Reached', 'You can attach a maximum of 5 images.');
      return;
    }
    const ok = await ensureCameraPermission();
    if (!ok) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const compressedUri = await compressImage(asset.uri);
      const size = await getFileSize(compressedUri);
      if (size > MAX_FILE_SIZE_BYTES) {
        Alert.alert('File Too Large', 'The image must be under 5 MB after compression.');
        return;
      }
      setImages((prev) => [
        ...prev,
        { uri: compressedUri, uploading: false },
      ]);
    }
  }, [images]);

  const handlePickFromGallery = useCallback(async () => {
    const remaining = 5 - images.length;
    if (remaining <= 0) {
      Alert.alert('Limit Reached', 'You can attach a maximum of 5 images.');
      return;
    }
    const ok = await ensureGalleryPermission();
    if (!ok) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 1,
    });

    if (!result.canceled) {
      const oversized: string[] = [];
      const valid: RatingImage[] = [];

      for (const asset of result.assets) {
        const compressedUri = await compressImage(asset.uri);
        const size = await getFileSize(compressedUri);
        if (size > MAX_FILE_SIZE_BYTES) {
          oversized.push(asset.fileName ?? 'image');
        } else {
          valid.push({ uri: compressedUri, uploading: false });
        }
      }

      if (oversized.length > 0) {
        Alert.alert(
          'Some Images Skipped',
          `${oversized.length} image(s) exceeded 5 MB and were not added.`
        );
      }
      setImages((prev) => [...prev, ...valid].slice(0, 5));
    }
  }, [images]);

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null);
    }
  }, [selectedImageIndex]);

  const handleImagePress = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  const uploadImageToServer = async (uri: string): Promise<string> => {
    const response = await fetch('https://jsonplaceholder.typicode.com/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        albumId: 1,
        title: 'Product review image',
        url: uri,
        thumbnailUrl: uri,
      }),
    });
    if (!response.ok) {
      throw new Error(`Upload failed: HTTP ${response.status}`);
    }
    // Return local URI as canonical URL since JSONPlaceholder doesn't store actual files
    return uri;
  };

  const handleSubmit = useCallback(async () => {
    setValidationError('');

    if (stars === 0) {
      setValidationError('Please select a star rating.');
      return;
    }
    if (!reviewText.trim()) {
      setValidationError('Please write a review before submitting.');
      return;
    }

    setIsSubmitting(true);

    const uploadedImages: RatingImage[] = [];
    for (let i = 0; i < images.length; i++) {
      setImages((prev) =>
        prev.map((img, idx) => (idx === i ? { ...img, uploading: true } : img))
      );
      try {
        const uploadedUrl = await uploadImageToServer(images[i].uri);
        uploadedImages.push({ ...images[i], uploading: false, uploadedUrl });
        setImages((prev) =>
          prev.map((img, idx) =>
            idx === i ? { ...img, uploading: false, uploadedUrl } : img
          )
        );
      } catch {
        uploadedImages.push({ ...images[i], uploading: false, error: 'Upload failed' });
        setImages((prev) =>
          prev.map((img, idx) =>
            idx === i ? { ...img, uploading: false, error: 'Upload failed' } : img
          )
        );
      }
    }

    const ratingId = addRating({
      productId: (typeof productId === 'string' ? productId : productId?.[0]) as string,
      stars,
      reviewText: reviewText.trim(),
      images: uploadedImages,
    });

    updateRating(ratingId, { submitted: true });

    setIsSubmitting(false);
    setSubmitSuccess(true);

    setTimeout(() => navigation.goBack(), 2000);
  }, [stars, reviewText, images, productId, addRating, updateRating, navigation]);

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.mediumText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (submitSuccess) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={[styles.successBox, { alignItems: 'center', paddingVertical: 40 }]}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>✅</Text>
            <Text style={[styles.subheader, styles.successText]}>Review Submitted!</Text>
            <Text style={[styles.mediumText, styles.successText, { marginTop: 8 }]}>
              Thank you for your review.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const selectedImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={[styles.scroll, selectedImageIndex !== null && { opacity: 0.5, pointerEvents: 'none' }]}>
        <View style={[styles.scrollContent, { gap: 16 }]}>
          <Text style={styles.subheader}>Rate {product.name}</Text>

          {validationError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{validationError}</Text>
            </View>
          )}

          <View style={styles.card}>
            <Text style={[styles.label, styles.boldText]}>Your Rating</Text>
            <View style={{ marginTop: 12, marginBottom: 12 }}>
              <StarRating value={stars} onChange={setStars} isDark={isDark} />
            </View>
            {stars > 0 && (
              <Text style={[styles.smallText, styles.secondaryText]}>
                {starLabels[stars]}
              </Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={[styles.label, styles.boldText]}>Write a Review</Text>
            <TextInput
              style={[styles.input, { marginTop: 8, minHeight: 100, textAlignVertical: 'top' }]}
              placeholder="Share your experience with this product..."
              placeholderTextColor={isDark ? '#64748b' : '#cbd5e1'}
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={[styles.label, styles.boldText]}>Attach Photos (optional)</Text>
              <Text style={styles.smallText}>
                {images.length}/5
              </Text>
            </View>

            <View style={[styles.row, { marginTop: 12, gap: 8 }]}>
              <TouchableOpacity
                onPress={handleTakePhoto}
                style={[styles.secondaryButton, { flex: 1 }]}>
                <Text style={styles.secondaryButtonText}>📷 Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePickFromGallery}
                style={[styles.secondaryButton, { flex: 1 }]}>
                <Text style={styles.secondaryButtonText}>🖼 From Gallery</Text>
              </TouchableOpacity>
            </View>

            {images.length > 0 && (
              <View style={{ marginTop: 12 }}>
                <ImageGrid
                  images={images}
                  onRemove={handleRemoveImage}
                  onImagePress={handleImagePress}
                  isDark={isDark}
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={[styles.button, isSubmitting && { opacity: 0.6 }]}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>✓ Submit Review</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={selectedImageIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImageIndex(null)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage.uri }}
                style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height * 0.7 }}
                contentFit="contain"
              />
            )}

            <TouchableOpacity
              onPress={() => setSelectedImageIndex(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 50,
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 28, color: '#fff', fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>

            {selectedImage?.uploading && (
              <View style={{ position: 'absolute', bottom: 30 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 }}>
                  <ActivityIndicator color="#fff" />
                  <Text style={{ color: '#fff', fontSize: 14 }}>Uploading...</Text>
                </View>
              </View>
            )}

            {selectedImage?.error && (
              <View style={{ position: 'absolute', bottom: 30 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(220,38,38,0.9)', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 }}>
                  <Text style={{ color: '#fff', fontSize: 14 }}>Upload Failed</Text>
                </View>
              </View>
            )}

            <View style={{ position: 'absolute', bottom: 30, flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  if (selectedImageIndex !== null) {
                    handleRemoveImage(selectedImageIndex);
                    setSelectedImageIndex(null);
                  }
                }}
                style={{
                  backgroundColor: '#dc2626',
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>🗑 Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedImageIndex(null)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 8,
                }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
