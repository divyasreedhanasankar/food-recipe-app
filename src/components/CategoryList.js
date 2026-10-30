import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { CATEGORIES } from '../data/categories';

const CategoryList = ({ selectedCategory, onSelectCategory }) => {
  const renderCategory = ({ item }) => {
    const isActive = selectedCategory === item.id;
    return (
      <TouchableOpacity
        style={[styles.categoryItem, isActive && styles.categoryItemActive]}
        onPress={() => onSelectCategory(item.id)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconContainer,
            isActive && styles.iconContainerActive,
          ]}
        >
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>
        <Text
          style={[styles.categoryName, isActive && styles.categoryNameActive]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.sm,
  },
  listContent: {
    paddingHorizontal: SIZES.base,
    gap: SIZES.sm,
  },
  categoryItem: {
    alignItems: 'center',
    width: 72,
    paddingVertical: SIZES.sm,
  },
  categoryItemActive: {},
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.creamDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  emoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 11,
    color: COLORS.gray,
    ...FONTS.medium,
    textAlign: 'center',
  },
  categoryNameActive: {
    color: COLORS.primary,
    ...FONTS.bold,
  },
});

export default CategoryList;
