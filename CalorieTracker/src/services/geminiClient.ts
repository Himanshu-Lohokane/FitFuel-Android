import * as SecureStore from 'expo-secure-store';

const API_KEY_STORAGE_KEY = 'gemini_api_key';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Gemini API client for calorie estimation
 */
class GeminiClient {
  /**
   * Store the API key securely
   */
  async setApiKey(apiKey: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, apiKey);
    } catch (error) {
      console.error('Error storing API key:', error);
      throw new Error('Failed to store API key securely');
    }
  }

  /**
   * Get the stored API key
   */
  async getApiKey(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error('Error retrieving API key:', error);
      return null;
    }
  }

  /**
   * Check if API key is configured
   */
  async hasApiKey(): Promise<boolean> {
    const apiKey = await this.getApiKey();
    return apiKey !== null && apiKey.trim() !== '';
  }

  /**
   * Remove the API key
   */
  async removeApiKey(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing API key:', error);
    }
  }

  /**
   * Estimate calories and protein for a food item using Gemini API
   */
  async estimateNutrition(foodItem: string): Promise<{calories: number, protein: number}> {
    const apiKey = await this.getApiKey();
    
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    try {
      const prompt = `Estimate calories and protein for: ${foodItem}. Respond with only two numbers separated by a comma: calories,protein (e.g., "150,12" for 150 calories and 12g protein).`;
      
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid API response format');
      }

      const responseText = data.candidates[0].content.parts[0].text.trim();
      
      // Extract calories and protein from response (format: "150,12")
      const nutritionMatch = responseText.match(/(\d+),(\d+)/);
      
      if (!nutritionMatch) {
        throw new Error('Could not parse nutrition data from response');
      }

      const calories = parseInt(nutritionMatch[1], 10);
      const protein = parseInt(nutritionMatch[2], 10);
      
      // Validate ranges
      if (calories < 1 || calories > 2000) {
        throw new Error('Calorie estimate seems unreasonable');
      }
      
      if (protein < 0 || protein > 200) {
        throw new Error('Protein estimate seems unreasonable');
      }

      return { calories, protein };
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Re-throw with more user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('API key not configured')) {
          throw new Error('Please configure your Gemini API key in settings');
        } else if (error.message.includes('API request failed')) {
          throw new Error('Failed to connect to Gemini API. Please check your internet connection and API key.');
        } else if (error.message.includes('parse calories')) {
          throw new Error('Could not understand the food item. Please try rephrasing or enter calories manually.');
        } else {
          throw new Error('Unable to estimate calories. Please try again or enter manually.');
        }
      }
      
      throw new Error('An unexpected error occurred while estimating calories.');
    }
  }

  /**
   * Test the API connection with a simple request
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.estimateNutrition('apple');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const geminiClient = new GeminiClient();
