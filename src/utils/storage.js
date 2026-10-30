import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@foodie_favorites';
const USER_RECIPES_KEY = '@foodie_user_recipes';

// ——— Favorites ———

export const getFavorites = async () => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

export const saveFavorites = async (favorites) => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

export const toggleFavorite = async (recipeId) => {
  try {
    const favorites = await getFavorites();
    const index = favorites.indexOf(recipeId);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(recipeId);
    }
    await saveFavorites(favorites);
    return favorites;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return [];
  }
};

// ——— User Recipes ———

export const getUserRecipes = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_RECIPES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading user recipes:', error);
    return [];
  }
};

export const saveUserRecipes = async (recipes) => {
  try {
    await AsyncStorage.setItem(USER_RECIPES_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Error saving user recipes:', error);
  }
};

export const addUserRecipe = async (recipe) => {
  try {
    const recipes = await getUserRecipes();
    const newRecipe = {
      ...recipe,
      id: 'user_' + Date.now(),
      isUserRecipe: true,
      createdAt: new Date().toISOString(),
    };
    recipes.push(newRecipe);
    await saveUserRecipes(recipes);
    return newRecipe;
  } catch (error) {
    console.error('Error adding recipe:', error);
    return null;
  }
};

export const updateUserRecipe = async (updatedRecipe) => {
  try {
    const recipes = await getUserRecipes();
    const index = recipes.findIndex((r) => r.id === updatedRecipe.id);
    if (index > -1) {
      recipes[index] = { ...recipes[index], ...updatedRecipe };
      await saveUserRecipes(recipes);
      return recipes[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating recipe:', error);
    return null;
  }
};

export const deleteUserRecipe = async (recipeId) => {
  try {
    const recipes = await getUserRecipes();
    const filtered = recipes.filter((r) => r.id !== recipeId);
    await saveUserRecipes(filtered);
    // Also remove from favorites if present
    const favorites = await getFavorites();
    const filteredFavorites = favorites.filter((id) => id !== recipeId);
    await saveFavorites(filteredFavorites);
    return true;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return false;
  }
};
