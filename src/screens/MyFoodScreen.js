import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useRecipes } from '../context/RecipeContext';

const { width } = Dimensions.get('window');

const MyFoodScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { userRecipes, deleteRecipe } = useRecipes();

  const handleDelete = useCallback(
    (recipe) => {
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
            },
          },
        ]
      );
    },
    [deleteRecipe]
  );

  const renderRecipeItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.recipeItem}
        onPress={() =>
          navigation.navigate('RecipeDetail', { recipeId: item.id })
        }
        activeOpacity={0.85}
      >
        <Image
          source={{
            uri:
              item.image ||
              'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=200&h=200&fit=crop',
          }}
          style={styles.recipeImage}
          resizeMode="cover"
        />
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.metaRow}>
            {item.prepTime ? (
              <View style={styles.metaItem}>
                <Ionicons
                  name="time-outline"
                  size={13}
                  color={COLORS.gray}
                />
                <Text style={styles.metaText}>{item.prepTime}</Text>
              </View>
            ) : null}
            {item.difficulty ? (
              <View style={styles.metaItem}>
                <Ionicons
                  name="speedometer-outline"
                  size={13}
                  color={COLORS.gray}
                />
                <Text style={styles.metaText}>{item.difficulty}</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() =>
              navigation.navigate('EditRecipe', { recipeId: item.id })
            }
          >
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteActionBtn]}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    ),
    [navigation, handleDelete]
  );

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Recipes 👨‍🍳</Text>
        <Text style={styles.headerSubtitle}>
          {userRecipes.length} custom recipe
          {userRecipes.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Add New Recipe Card */}
      <TouchableOpacity
        style={styles.addCard}
        onPress={() => navigation.navigate('AddRecipe')}
        activeOpacity={0.85}
      >
        <View style={styles.addCardIcon}>
          <Ionicons name="add" size={32} color={COLORS.white} />
        </View>
        <View style={styles.addCardContent}>
          <Text style={styles.addCardTitle}>Add New Recipe</Text>
          <Text style={styles.addCardSubtitle}>
            Share your culinary creation
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={22}
          color={COLORS.primaryLight}
        />
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <Ionicons
          name="book-outline"
          size={64}
          color={COLORS.grayLight}
        />
      </View>
      <Text style={styles.emptyTitle}>No Recipes Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap "Add New Recipe" above to create your first masterpiece!
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
      <FlatList
        data={userRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id}
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
    paddingBottom: SIZES.sm,
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
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.base,
    marginVertical: SIZES.md,
    padding: SIZES.base,
    borderRadius: SIZES.radiusLg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  addCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  addCardContent: {
    flex: 1,
  },
  addCardTitle: {
    fontSize: 17,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  addCardSubtitle: {
    fontSize: 13,
    color: COLORS.gray,
    ...FONTS.regular,
    marginTop: 2,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.base,
    marginBottom: SIZES.md,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  recipeImage: {
    width: 90,
    height: 90,
  },
  recipeInfo: {
    flex: 1,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  recipeName: {
    fontSize: 15,
    color: COLORS.brownDark,
    ...FONTS.semiBold,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.gray,
    ...FONTS.medium,
  },
  actions: {
    paddingRight: SIZES.md,
    gap: SIZES.sm,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.creamDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteActionBtn: {
    backgroundColor: '#FDECEA',
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

export default MyFoodScreen;
