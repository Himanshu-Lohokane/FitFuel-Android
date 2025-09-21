/**
 * Offline dictionary of common foods with calorie estimates
 * Used as fallback when Gemini API is unavailable
 */

export interface FoodItem {
  name: string;
  calories: number;
}

export const COMMON_FOODS: Record<string, number> = {
  // Fruits
  'apple': 80,
  'banana': 105,
  'orange': 62,
  'grape': 62,
  'strawberry': 4,
  'blueberry': 84,
  'avocado': 234,
  'grapes': 62,
  
  // Vegetables
  'carrot': 25,
  'broccoli': 55,
  'spinach': 7,
  'tomato': 22,
  'cucumber': 16,
  'lettuce': 5,
  'onion': 40,
  'potato': 130,
  
  // Grains & Bread
  'bread slice': 70,
  'rice cup': 200,
  'pasta cup': 220,
  'oatmeal cup': 154,
  'cereal cup': 110,
  'quinoa cup': 222,
  
  // Proteins
  'chicken breast': 165,
  'egg': 70,
  'salmon': 206,
  'tuna': 179,
  'beef': 250,
  'pork': 242,
  'tofu': 94,
  'beans cup': 227,
  
  // Dairy
  'milk cup': 150,
  'cheese slice': 113,
  'yogurt cup': 150,
  'butter tbsp': 102,
  'cream cheese': 50,
  
  // Nuts & Seeds
  'almonds': 164,
  'walnuts': 185,
  'peanut butter tbsp': 94,
  'cashews': 157,
  
  // Beverages
  'water': 0,
  'coffee': 2,
  'tea': 2,
  'orange juice cup': 112,
  'apple juice cup': 117,
  
  // Snacks
  'chocolate bar': 250,
  'cookies': 140,
  'chips': 160,
  'popcorn cup': 31,
  'nuts': 164,
};

/**
 * Search for a food item in the offline dictionary
 * Returns calories if found, null otherwise
 */
export const searchOfflineFood = (foodName: string): number | null => {
  const normalizedName = foodName.toLowerCase().trim();
  
  // Direct match
  if (COMMON_FOODS[normalizedName]) {
    return COMMON_FOODS[normalizedName];
  }
  
  // Partial match for common variations
  for (const [key, calories] of Object.entries(COMMON_FOODS)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return calories;
    }
  }
  
  return null;
};

/**
 * Get all available food items from the offline dictionary
 */
export const getAllOfflineFoods = (): FoodItem[] => {
  return Object.entries(COMMON_FOODS).map(([name, calories]) => ({
    name,
    calories
  }));
};
