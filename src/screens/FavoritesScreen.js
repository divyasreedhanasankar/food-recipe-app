import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useRecipes } from '../context/RecipeContext';
import RecipeCard from '../components/RecipeCard';

const FavoritesScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { getFavoriteRecipes, toggleFavorite, isFavorite } = useRecipes();
  const favorites = getFavoriteRecipes();

  const handleRecipePress = useCallback(
    (recipe) => {
      navigation.navigate('RecipeDetail', { recipeId: recipe.id });
    },
    [navigation]
  );

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

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="heart-outline" size={72} color={COLORS.grayLight} />
      </View>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the heart icon on any recipe to save it to your favorites!
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Favorites ❤️</Text>
      <Text style={styles.headerSubtitle}>
        {favorites.length} saved recipe{favorites.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
      <FlatList
        data={favorites}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={favorites.length > 0 ? styles.row : undefined}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  header: {
    paddingHorizontal: SIZES.base,
    paddingTop: SIZES.base,
    paddingBottom: SIZES.lg,
  },
  headerTitle: {
    fontSize: 26,
    color: COLORS.brownDark,
    ...FONTS.bold,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    ...FONTS.regular,
    marginTop: 4,
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
  emptyIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.creamDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  emptyTitle: {
    fontSize: 20,
    color: COLORS.brownDark,
    ...FONTS.bold,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    ...FONTS.regular,
    textAlign: 'center',
    marginTop: SIZES.sm,
    lineHeight: 21,
  },
});

export default FavoritesScreen;
