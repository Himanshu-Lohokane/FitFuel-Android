/**
 * Simple error handler for better user experience
 */

export const handleFoodInputError = (error: any): string => {
  if (error instanceof Error) {
    if (error.message.includes('API key not configured')) {
      return 'Please configure your Gemini API key in settings first.';
    } else if (error.message.includes('API request failed')) {
      return 'Connection failed. Please check your internet and try again.';
    } else if (error.message.includes('parse calories')) {
      return 'Could not understand the food item. Please try rephrasing.';
    } else if (error.message.includes('unreasonable')) {
      return 'Calorie estimate seems too high/low. Please enter manually.';
    }
  }
  
  return 'Something went wrong. Please try again or enter calories manually.';
};

export const validateCalorieInput = (input: string): { isValid: boolean; calories?: number; error?: string } => {
  const calories = parseInt(input, 10);
  
  if (isNaN(calories)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }
  
  if (calories < 1) {
    return { isValid: false, error: 'Calories must be at least 1' };
  }
  
  if (calories > 2000) {
    return { isValid: false, error: 'Calories seem too high (max 2000)' };
  }
  
  return { isValid: true, calories };
};
