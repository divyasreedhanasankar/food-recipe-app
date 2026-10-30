import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SIZES.base * 2 - SIZES.md) / 2;

const RecipeCard = ({ recipe, onPress, isFavorite, onToggleFavorite }) => {
  const difficultyColor =
    recipe.difficulty === 'Easy'
      ? COLORS.success
      : recipe.difficulty === 'Medium'
      ? COLORS.warning
      : COLORS.danger;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(recipe)}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        {/* Favorite Heart */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={(e) => {
            e.stopPropagation && e.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? COLORS.accent : COLORS.white}
          />
        </TouchableOpacity>
        {/* Difficulty Badge */}
        <View style={[styles.badge, { backgroundColor: difficultyColor }]}>
          <Text style={styles.badgeText}>{recipe.difficulty}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {recipe.name}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={COLORS.gray} />
            <Text style={styles.metaText}>{recipe.prepTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="flame-outline" size={13} color={COLORS.primary} />
            <Text style={styles.metaText}>{recipe.calories} cal</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    marginBottom: SIZES.base,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  heartButton: {
    position: 'absolute',
    top: SIZES.sm,
    right: SIZES.sm,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: SIZES.sm,
    left: SIZES.sm,
    paddingHorizontal: SIZES.sm,
    paddingVertical: 3,
    borderRadius: SIZES.radiusSm,
  },
  badgeText: {
    fontSize: 10,
    color: COLORS.white,
    ...FONTS.bold,
  },
  info: {
    padding: SIZES.md,
  },
  name: {
    fontSize: 14,
    color: COLORS.brownDark,
    ...FONTS.semiBold,
    marginBottom: SIZES.xs,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.gray,
    ...FONTS.medium,
  },
});

export default memo(RecipeCard);
