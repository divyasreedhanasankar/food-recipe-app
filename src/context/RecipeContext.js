import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SAMPLE_RECIPES } from '../data/recipes';
import {
  getFavorites,
  saveFavorites,
  getUserRecipes,
  addUserRecipe as addRecipeToStorage,
  updateUserRecipe as updateRecipeInStorage,
  deleteUserRecipe as deleteRecipeFromStorage,
} from '../utils/storage';

const RecipeContext = createContext();

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};

export const RecipeProvider = ({ children }) => {
  const [sampleRecipes] = useState(SAMPLE_RECIPES);
  const [userRecipes, setUserRecipes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [favs, userRecs] = await Promise.all([
        getFavorites(),
        getUserRecipes(),
      ]);
      setFavoriteIds(favs || []);
      setUserRecipes(userRecs || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // All recipes combined
  const allRecipes = [...sampleRecipes, ...userRecipes];

  // Toggle favorite
  const toggleFavorite = useCallback(async (recipeId) => {
    setFavoriteIds((prev) => {
      const updated = prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId];
      saveFavorites(updated);
      return updated;
    });
  }, []);

  // Check if recipe is favorite
  const isFavorite = useCallback(
    (recipeId) => favoriteIds.includes(recipeId),
    [favoriteIds]
  );

  // Get favorite recipes
  const getFavoriteRecipes = useCallback(() => {
    return allRecipes.filter((r) => favoriteIds.includes(r.id));
  }, [allRecipes, favoriteIds]);

  // Get recipes by category
  const getRecipesByCategory = useCallback(
    (categoryId) => {
      if (categoryId === 'all') return allRecipes;
      if (categoryId === 'my_food') return userRecipes;
      return allRecipes.filter((r) => r.category === categoryId);
    },
    [allRecipes, userRecipes]
  );

  // Get recipe by id
  const getRecipeById = useCallback(
    (recipeId) => {
      return allRecipes.find((r) => r.id === recipeId) || null;
    },
    [allRecipes]
  );

  // Add user recipe
  const addRecipe = useCallback(async (recipe) => {
    const newRecipe = await addRecipeToStorage(recipe);
    if (newRecipe) {
      setUserRecipes((prev) => [...prev, newRecipe]);
      return newRecipe;
    }
    return null;
  }, []);

  // Update user recipe
  const updateRecipe = useCallback(async (recipe) => {
    const updated = await updateRecipeInStorage(recipe);
    if (updated) {
      setUserRecipes((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
      return updated;
    }
    return null;
  }, []);

  // Delete user recipe
  const deleteRecipe = useCallback(async (recipeId) => {
    const success = await deleteRecipeFromStorage(recipeId);
    if (success) {
      setUserRecipes((prev) => prev.filter((r) => r.id !== recipeId));
      setFavoriteIds((prev) => prev.filter((id) => id !== recipeId));
      return true;
    }
    return false;
  }, []);

  const value = {
    allRecipes,
    sampleRecipes,
    userRecipes,
    favoriteIds,
    isLoading,
    toggleFavorite,
    isFavorite,
    getFavoriteRecipes,
    getRecipesByCategory,
    getRecipeById,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  };

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
};
