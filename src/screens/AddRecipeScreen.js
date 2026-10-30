import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useRecipes } from '../context/RecipeContext';
import { CATEGORIES } from '../data/categories';

// Conditionally import expo-image-picker (works on native/Snack, not web)
let ImagePicker = null;
try {
  ImagePicker = require('expo-image-picker');
} catch (_) {}

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];
const RECIPE_CATEGORIES = CATEGORIES.filter(
  (c) => c.id !== 'all' && c.id !== 'my_food'
);

const AddRecipeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { addRecipe } = useRecipes();

  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('dinner');
  const [prepTime, setPrepTime] = useState('');
  const [servings, setServings] = useState('');
  const [calories, setCalories] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image Picker — expo-image-picker on native/Snack, HTML file input on web
  const pickImage = useCallback(async () => {
    if (Platform.OS !== 'web' && ImagePicker) {
      try {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Permission Required', 'Please allow access to your photo library.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setImage(result.assets[0].uri);
        }
      } catch (e) {
        console.warn('Image picker error:', e);
      }
    } else if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.cssText = 'position:fixed;top:-200px;left:-200px;opacity:0;';
      document.body.appendChild(input);
      input.onchange = (e) => {
        const file = e.target && e.target.files && e.target.files[0];
        if (!file) { document.body.removeChild(input); return; }
        const reader = new FileReader();
        reader.onload = (ev) => { setImage(ev.target.result); document.body.removeChild(input); };
        reader.readAsDataURL(file);
      };
      input.click();
    }
  }, []);

  // Ingredient management
  const addIngredient = useCallback(() => {
    setIngredients((prev) => [...prev, '']);
  }, []);

  const updateIngredient = useCallback((index, value) => {
    setIngredients((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  const removeIngredient = useCallback((index) => {
    setIngredients((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // Instruction management
  const addInstruction = useCallback(() => {
    setInstructions((prev) => [...prev, '']);
  }, []);

  const updateInstruction = useCallback((index, value) => {
    setInstructions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  const removeInstruction = useCallback((index) => {
    setInstructions((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // Validation & Save
  const handleSave = useCallback(async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a recipe name.');
      return;
    }
    const filteredIngredients = ingredients.filter((i) => i.trim());
    if (filteredIngredients.length === 0) {
      Alert.alert(
        'Validation Error',
        'Please add at least one ingredient.'
      );
      return;
    }
    const filteredInstructions = instructions.filter((i) => i.trim());
    if (filteredInstructions.length === 0) {
      Alert.alert(
        'Validation Error',
        'Please add at least one instruction step.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const recipeData = {
        name: name.trim(),
        image:
          image ||
          'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=600&h=400&fit=crop',
        category,
        prepTime: prepTime.trim() || 'N/A',
        servings: parseInt(servings, 10) || 1,
        calories: parseInt(calories, 10) || 0,
        difficulty,
        ingredients: filteredIngredients,
        instructions: filteredInstructions,
      };

      const result = await addRecipe(recipeData);
      if (result) {
        Alert.alert('Success!', 'Your recipe has been saved.', [
          {
            text: 'Great!',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to save recipe. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    name,
    image,
    category,
    prepTime,
    servings,
    calories,
    difficulty,
    ingredients,
    instructions,
    addRecipe,
    navigation,
  ]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.brownDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Recipe</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Image Picker */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.pickedImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePickerPlaceholder}>
                <Ionicons
                  name="camera-outline"
                  size={40}
                  color={COLORS.primaryLight}
                />
                <Text style={styles.imagePickerText}>
                  Tap to add a photo
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Recipe Name */}
          <View style={styles.field}>
            <Text style={styles.label}>Recipe Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Grandma's Apple Pie"
              placeholderTextColor={COLORS.grayLight}
            />
          </View>

          {/* Category Selector */}
          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
            >
              {RECIPE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.chip,
                    category === cat.id && styles.chipActive,
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text style={styles.chipEmoji}>{cat.emoji}</Text>
                  <Text
                    style={[
                      styles.chipText,
                      category === cat.id && styles.chipTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Row: Prep Time, Servings, Calories */}
          <View style={styles.rowFields}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Prep Time</Text>
              <TextInput
                style={styles.input}
                value={prepTime}
                onChangeText={setPrepTime}
                placeholder="e.g., 30 min"
                placeholderTextColor={COLORS.grayLight}
              />
            </View>
            <View style={[styles.field, { flex: 1, marginHorizontal: SIZES.sm }]}>
              <Text style={styles.label}>Servings</Text>
              <TextInput
                style={styles.input}
                value={servings}
                onChangeText={setServings}
                placeholder="e.g., 4"
                keyboardType="numeric"
                placeholderTextColor={COLORS.grayLight}
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Calories</Text>
              <TextInput
                style={styles.input}
                value={calories}
                onChangeText={setCalories}
                placeholder="e.g., 350"
                keyboardType="numeric"
                placeholderTextColor={COLORS.grayLight}
              />
            </View>
          </View>

          {/* Difficulty */}
          <View style={styles.field}>
            <Text style={styles.label}>Difficulty</Text>
            <View style={styles.difficultyRow}>
              {DIFFICULTY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.difficultyBtn,
                    difficulty === opt && styles.difficultyBtnActive,
                    difficulty === opt && {
                      backgroundColor:
                        opt === 'Easy'
                          ? COLORS.success
                          : opt === 'Medium'
                          ? COLORS.warning
                          : COLORS.danger,
                    },
                  ]}
                  onPress={() => setDifficulty(opt)}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      difficulty === opt && styles.difficultyTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.field}>
            <View style={styles.fieldHeader}>
              <Text style={styles.label}>Ingredients *</Text>
              <TouchableOpacity onPress={addIngredient}>
                <Ionicons
                  name="add-circle"
                  size={28}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
            {ingredients.map((item, index) => (
              <View key={index} style={styles.listInputRow}>
                <View style={styles.listBullet}>
                  <Text style={styles.listBulletText}>{index + 1}</Text>
                </View>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={item}
                  onChangeText={(text) => updateIngredient(index, text)}
                  placeholder={`Ingredient ${index + 1}`}
                  placeholderTextColor={COLORS.grayLight}
                />
                {ingredients.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeIngredient(index)}
                    style={styles.removeBtn}
                  >
                    <Ionicons
                      name="close-circle"
                      size={22}
                      color={COLORS.danger}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Instructions */}
          <View style={styles.field}>
            <View style={styles.fieldHeader}>
              <Text style={styles.label}>Instructions *</Text>
              <TouchableOpacity onPress={addInstruction}>
                <Ionicons
                  name="add-circle"
                  size={28}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
            {instructions.map((item, index) => (
              <View key={index} style={styles.listInputRow}>
                <View style={[styles.listBullet, { backgroundColor: COLORS.primary }]}>
                  <Text style={[styles.listBulletText, { color: COLORS.white }]}>
                    {index + 1}
                  </Text>
                </View>
                <TextInput
                  style={[styles.input, styles.multilineInput, { flex: 1 }]}
                  value={item}
                  onChangeText={(text) => updateInstruction(index, text)}
                  placeholder={`Step ${index + 1}`}
                  placeholderTextColor={COLORS.grayLight}
                  multiline
                />
                {instructions.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeInstruction(index)}
                    style={styles.removeBtn}
                  >
                    <Ionicons
                      name="close-circle"
                      size={22}
                      color={COLORS.danger}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveBtn, isSubmitting && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            <Ionicons
              name="checkmark-circle"
              size={22}
              color={COLORS.white}
            />
            <Text style={styles.saveBtnText}>
              {isSubmitting ? 'Saving...' : 'Save Recipe'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.creamDark,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.creamDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 19,
    color: COLORS.brownDark,
    ...FONTS.bold,
  },
  formContent: {
    padding: SIZES.base,
    paddingBottom: SIZES.xxxl * 2,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    marginBottom: SIZES.lg,
    backgroundColor: COLORS.creamDark,
    borderWidth: 2,
    borderColor: COLORS.creamDark,
    borderStyle: 'dashed',
  },
  pickedImage: {
    width: '100%',
    height: '100%',
  },
  imagePickerPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: {
    fontSize: 14,
    color: COLORS.gray,
    ...FONTS.medium,
    marginTop: SIZES.sm,
  },
  field: {
    marginBottom: SIZES.lg,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  label: {
    fontSize: 14,
    color: COLORS.brownDark,
    ...FONTS.semiBold,
    marginBottom: SIZES.sm,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    fontSize: 14,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.creamDark,
    ...FONTS.regular,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  chipScroll: {
    marginTop: -SIZES.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.white,
    marginRight: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.creamDark,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.gray,
    ...FONTS.medium,
  },
  chipTextActive: {
    color: COLORS.white,
    ...FONTS.bold,
  },
  rowFields: {
    flexDirection: 'row',
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: SIZES.sm,
    marginTop: -SIZES.xs,
  },
  difficultyBtn: {
    flex: 1,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.creamDark,
  },
  difficultyBtnActive: {
    borderColor: 'transparent',
  },
  difficultyText: {
    fontSize: 14,
    color: COLORS.gray,
    ...FONTS.medium,
  },
  difficultyTextActive: {
    color: COLORS.white,
    ...FONTS.bold,
  },
  listInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
    gap: SIZES.sm,
  },
  listBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.creamDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listBulletText: {
    fontSize: 12,
    color: COLORS.brownDark,
    ...FONTS.bold,
  },
  removeBtn: {
    padding: SIZES.xs,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radiusMd,
    marginTop: SIZES.lg,
    gap: SIZES.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 17,
    ...FONTS.bold,
  },
});

export default AddRecipeScreen;
