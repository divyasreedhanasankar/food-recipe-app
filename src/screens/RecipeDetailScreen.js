import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useRecipes } from '../context/RecipeContext';

const { width } = Dimensions.get('window');

const RecipeDetailScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { recipeId } = route.params;
  const { getRecipeById, toggleFavorite, isFavorite, deleteRecipe } =
    useRecipes();

  const recipe = getRecipeById(recipeId);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipe.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteRecipe(recipe.id);
            navigation.goBack();
          },
        },
      ]
    );
  }, [recipe, deleteRecipe, navigation]);

  if (!recipe) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.gray} />
        <Text style={styles.errorText}>Recipe not found</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const difficultyColor =
    recipe.difficulty === 'Easy'
      ? COLORS.success
      : recipe.difficulty === 'Medium'
      ? COLORS.warning
      : COLORS.danger;

  const favorite = isFavorite(recipe.id);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={{ paddingBottom: SIZES.xxxl }}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: recipe.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />

          {/* Top Buttons */}
          <View style={[styles.topBar, { top: insets.top + SIZES.sm }]}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={22} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => toggleFavorite(recipe.id)}
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={22}
                color={favorite ? COLORS.accent : COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* Title Overlay */}
          <View style={styles.titleOverlay}>
            <Text style={styles.heroTitle}>{recipe.name}</Text>
            <View style={[styles.diffBadge, { backgroundColor: difficultyColor }]}>
              <Text style={styles.diffBadgeText}>{recipe.difficulty}</Text>
            </View>
          </View>
        </View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={20} color={COLORS.primary} />
            <Text style={styles.statValue}>{recipe.prepTime}</Text>
            <Text style={styles.statLabel}>Prep Time</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={20} color={COLORS.primary} />
            <Text style={styles.statValue}>{recipe.servings}</Text>
            <Text style={styles.statLabel}>Servings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="flame-outline" size={20} color={COLORS.primary} />
            <Text style={styles.statValue}>{recipe.calories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons
              name="speedometer-outline"
              size={20}
              color={difficultyColor}
            />
            <Text style={[styles.statValue, { color: difficultyColor }]}>
              {recipe.difficulty}
            </Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={22} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {recipe.ingredients ? recipe.ingredients.length : 0}
              </Text>
            </View>
          </View>
          {recipe.ingredients &&
            recipe.ingredients.map((item, index) => (
              <View key={index} style={styles.ingredientRow}>
                <View style={styles.bullet} />
                <Text style={styles.ingredientText}>{item}</Text>
              </View>
            ))}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="reader-outline"
              size={22}
              color={COLORS.primary}
            />
            <Text style={styles.sectionTitle}>Instructions</Text>
          </View>
          {recipe.instructions &&
            recipe.instructions.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
        </View>

        {/* Edit / Delete for user recipes */}
        {recipe.isUserRecipe && (
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() =>
                navigation.navigate('EditRecipe', { recipeId: recipe.id })
              }
            >
              <Ionicons name="create-outline" size={20} color={COLORS.white} />
              <Text style={styles.editBtnText}>Edit Recipe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Ionicons
                name="trash-outline"
                size={20}
                color={COLORS.white}
              />
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: COLORS.gray,
    ...FONTS.semiBold,
    marginTop: SIZES.base,
  },
  backBtn: {
    marginTop: SIZES.lg,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
  },
  backBtnText: {
    color: COLORS.white,
    ...FONTS.semiBold,
    fontSize: 15,
  },
  heroContainer: {
    width: width,
    height: width * 0.75,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  topBar: {
    position: 'absolute',
    left: SIZES.base,
    right: SIZES.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: SIZES.lg,
    left: SIZES.base,
    right: SIZES.base,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  heroTitle: {
    fontSize: 24,
    color: COLORS.white,
    ...FONTS.bold,
    flex: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  diffBadge: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusFull,
    marginLeft: SIZES.sm,
  },
  diffBadgeText: {
    fontSize: 12,
    color: COLORS.white,
    ...FONTS.bold,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.base,
    marginTop: -SIZES.lg,
    borderRadius: SIZES.radiusLg,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.sm,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    color: COLORS.brownDark,
    ...FONTS.bold,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.gray,
    ...FONTS.regular,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.grayUltraLight,
  },
  section: {
    marginHorizontal: SIZES.base,
    marginTop: SIZES.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
    gap: SIZES.sm,
  },
  sectionTitle: {
    fontSize: 19,
    color: COLORS.brownDark,
    ...FONTS.bold,
    flex: 1,
  },
  countBadge: {
    backgroundColor: COLORS.primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadgeText: {
    fontSize: 12,
    color: COLORS.white,
    ...FONTS.bold,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayUltraLight,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryLight,
    marginRight: SIZES.md,
  },
  ingredientText: {
    fontSize: 14,
    color: COLORS.black,
    ...FONTS.regular,
    flex: 1,
    lineHeight: 20,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: SIZES.base,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 13,
    color: COLORS.white,
    ...FONTS.bold,
  },
  stepText: {
    fontSize: 14,
    color: COLORS.black,
    ...FONTS.regular,
    flex: 1,
    lineHeight: 22,
  },
  actionSection: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.base,
    marginTop: SIZES.xl,
    gap: SIZES.md,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
    gap: SIZES.sm,
  },
  editBtnText: {
    color: COLORS.white,
    fontSize: 15,
    ...FONTS.semiBold,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    borderRadius: SIZES.radiusMd,
    gap: SIZES.sm,
  },
  deleteBtnText: {
    color: COLORS.white,
    fontSize: 15,
    ...FONTS.semiBold,
  },
});

export default RecipeDetailScreen;
