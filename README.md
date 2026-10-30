# 🍳 Foodie – Recipe App

A beautiful, fully functional React Native Expo recipe application built with a warm cream, orange and brown food-themed design.

---

## 📱 Features

### 1. Main Feed
- 12 horizontally scrollable recipe categories (Breakfast, Lunch, Dinner, Appetizers, Desserts, Smoothies, Salads, Soups, Seafood, Vegan, My Food)
- Attractive recipe cards with food images in a 2-column grid
- Category filtering — tap a category to filter recipes
- My Food category shows user-created recipes
- Pull-to-refresh support

### 2. Recipe Details
- Full-screen hero image with overlay
- Recipe name and difficulty badge
- Stats bar showing prep time, servings, calories, difficulty level
- Complete ingredients list with count badge
- Numbered step-by-step instructions
- Favorite toggle (heart icon)
- Edit and Delete buttons for user-created recipes

### 3. Favorites
- Heart icon on every recipe card and detail screen
- Toggle between favorite and unfavorite
- Dedicated Favorites tab showing all saved recipes
- Empty state with helpful message

### 4. My Food
- Dedicated My Recipes section accessible from bottom tab
- "Add New Recipe" card prominently displayed
- List view of all user-created recipes with image thumbnails

### 5. Add New Recipe
Complete form with:
- **Image upload** using Expo Image Picker
- Recipe name input
- Category selector (horizontal chip scroll)
- Prep time, servings, calories fields
- Difficulty selector (Easy / Medium / Hard)
- Dynamic ingredients list (add/remove)
- Dynamic step-by-step instructions (add/remove)
- Save Recipe button with validation

### 6. My Recipes Management
- View all created recipes in a list format
- Tap to open full recipe details
- Edit button → opens pre-populated edit form
- Delete button → confirmation dialog → removes recipe
- Data persists across sessions via AsyncStorage

### 7. Navigation
- Bottom tab navigation (Home, Favorites, My Food)
- Stack navigation within each tab for proper back behavior
- No navigation errors — all screens accessible

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native + Expo SDK 51 | Core framework |
| JavaScript | Programming language |
| React Navigation v6 | Bottom tabs + native stack navigation |
| AsyncStorage | Persistent storage for favorites & user recipes |
| Expo Image Picker | Image selection for recipes |
| @expo/vector-icons (Ionicons) | Icons throughout the app |
| React Context API | Global state management |

---

## 🎨 Design

- **Color Palette**: Warm cream (#FFF8F0), orange (#E8742A), brown (#6B3A2A)
- **Responsive layout** adapting to screen width
- **Card-based design** with shadows and rounded corners
- **Emoji-based category icons** for visual appeal
- **Difficulty color coding**: Green (Easy), Orange (Medium), Red (Hard)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI (optional, npx works too)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd snack

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan the QR code with the Expo Go app

---

## 📂 Project Structure

```
snack/
├── App.js                          # Root component
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── babel.config.js                 # Babel config
├── assets/                         # Static assets
└── src/
    ├── components/
    │   ├── CategoryList.js         # Horizontal category filter
    │   └── RecipeCard.js           # Recipe card component
    ├── constants/
    │   └── theme.js                # Colors, fonts, sizes
    ├── context/
    │   └── RecipeContext.js         # Global state (React Context)
    ├── data/
    │   ├── categories.js           # Category definitions
    │   └── recipes.js              # 16 sample recipes
    ├── navigation/
    │   └── AppNavigator.js         # Tab + Stack navigators
    ├── screens/
    │   ├── HomeScreen.js           # Main feed
    │   ├── RecipeDetailScreen.js   # Recipe details
    │   ├── FavoritesScreen.js      # Saved favorites
    │   ├── MyFoodScreen.js         # User recipes list
    │   ├── AddRecipeScreen.js      # Add new recipe form
    │   └── EditRecipeScreen.js     # Edit existing recipe
    └── utils/
        └── storage.js              # AsyncStorage helpers
```

---

## 🔗 Expo Snack Compatibility

This project is designed to be compatible with **Expo Snack's Import Git Repository** feature:

- ✅ Uses only Expo-compatible packages
- ✅ No custom native modules
- ✅ No native configuration files (no `ios/` or `android/` folders)
- ✅ Standard Expo SDK 51 dependencies
- ✅ Entry point is `App.js` at root

### To import in Expo Snack:
1. Push this project to a GitHub repository
2. Go to [snack.expo.dev](https://snack.expo.dev)
3. Click **"Import Git Repository"**
4. Paste your repository URL
5. The app should load and run in the browser preview

---

## ✅ Evaluation Criteria Coverage

| # | Criterion | Implementation |
|---|---|---|
| 1 | Main Feed with categories | 12 categories, horizontal scroll, filtering |
| 2 | Recipe cards with images | 2-column grid, food images, meta info |
| 3 | Recipe details | Full detail screen with all required info |
| 4 | Favorites functionality | Heart toggle, persistent, dedicated tab |
| 5 | My Food section | Dedicated tab with user recipes |
| 6 | Add New Recipe | Complete form with image picker |
| 7 | Recipe management | Edit, delete with confirmation |
| 8 | Navigation | Bottom tabs + stack navigation |
| 9 | Data persistence | AsyncStorage for favorites & recipes |
| 10 | UI/UX quality | Warm themed palette, responsive, modern |
| 11 | Validation & error handling | Form validation, error states, alerts |
| 12 | Clean architecture | Components, context, utils separation |

---

## 📄 License

This project is for educational purposes.
