import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useRecipes } from '../context/RecipeContext';
import CategoryList from '../components/CategoryList';
import RecipeCard from '../components/RecipeCard';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const { getRecipesByCategory, toggleFavorite, isFavorite, allRecipes } =
    useRecipes();

  const filteredRecipes = getRecipesByCategory(selectedCategory);

  const handleSelectCategory = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'my_food') {
      // Optionally navigate to My Food tab instead
    }
  }, []);

  const handleRecipePress = useCallback(
    (recipe) => {
      navigation.navigate('RecipeDetail', { recipeId: recipe.id });
    },
    [navigation]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((r) => setTimeout(r, 800));
    setRefreshing(false);
  }, []);

  const renderRecipe = useCallback(
    ({ item }) => (
      <RecipeCard
        recipe={item}
        onPress={handleRecipePress}
        isFavorite={isFavorite(item.id)}
        onToggleFavorite={toggleFavorite}
      />
    ),
    [handleRecipePress, isFavorite, toggleFavorite]
  );

  const renderHeader = () => (
    <View>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.greeting}>Hello, Chef! 👋</Text>
          <Text style={styles.subtitle}>What would you like to cook?</Text>
        </View>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🍳</Text>
        </View>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Discover New{'\n'}Recipes Daily</Text>
          <Text style={styles.bannerSubtitle}>
            {allRecipes.length}+ delicious recipes
          </Text>
        </View>
        <Text style={styles.bannerEmoji}>🍕</Text>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'all'
            ? 'All Recipes'
            : selectedCategory === 'my_food'
            ? 'My Recipes'
            : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Recipes`}
        </Text>
        <Text style={styles.resultCount}>
          {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="restaurant-outline" size={64} color={COLORS.grayLight} />
      <Text style={styles.emptyTitle}>No Recipes Found</Text>
      <Text style={styles.emptySubtitle}>
        {selectedCategory === 'my_food'
          ? 'Add your first recipe from the My Food tab!'
          : 'Try selecting a different category'}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  listContent: {
    paddingBottom: SIZES.xxxl,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.base,
    paddingTop: SIZES.base,
    paddingBottom: SIZES.sm,
  },
  greeting: {
    fontSize: 26,
    color: COLORS.brownDark,
    ...FONTS.bold,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.gray,
    ...FONTS.regular,
    marginTop: 2,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.creamDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
  },
  banner: {
    marginHorizontal: SIZES.base,
    marginVertical: SIZES.md,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusXl,
    padding: SIZES.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 22,
    color: COLORS.white,
    ...FONTS.bold,
    lineHeight: 28,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    ...FONTS.medium,
    marginTop: SIZES.xs,
  },
  bannerEmoji: {
    fontSize: 60,
    marginLeft: SIZES.base,
  },
  sectionTitle: {
    fontSize: 19,
    color: COLORS.brownDark,
    ...FONTS.bold,
    paddingHorizontal: SIZES.base,
    marginTop: SIZES.sm,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: SIZES.base,
    marginBottom: SIZES.md,
    marginTop: SIZES.sm,
  },
  resultCount: {
    fontSize: 13,
    color: COLORS.gray,
    ...FONTS.medium,
  },
  row: {
    paddingHorizontal: SIZES.base,
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xxxl * 2,
    paddingHorizontal: SIZES.xl,
  },
  emptyTitle: {
    fontSize: 18,
    color: COLORS.brownDark,
    ...FONTS.semiBold,
    marginTop: SIZES.base,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    ...FONTS.regular,
    textAlign: 'center',
    marginTop: SIZES.sm,
  },
});

export default HomeScreen;
