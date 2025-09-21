import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { geminiClient } from '../services/geminiClient';
import { handleFoodInputError, validateCalorieInput } from '../services/errorHandler';

interface FoodInputProps {
  onAddFood: (name: string, calories: number, protein: number) => void;
  disabled?: boolean;
}

export const FoodInput: React.FC<FoodInputProps> = ({ onAddFood, disabled = false }) => {
  const [foodName, setFoodName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFood = async () => {
    if (!foodName.trim()) {
      Alert.alert('Error', 'Please enter a food item');
      return;
    }

    setIsLoading(true);

    try {
      // Always use Gemini AI - simple and smart
      const nutrition = await geminiClient.estimateNutrition(foodName);

      if (nutrition !== null) {
        // Show confirmation with AI estimate
        Alert.alert(
          'Confirm Nutrition',
          `🤖 Estimated for "${foodName}":\n${nutrition.calories} calories, ${nutrition.protein}g protein\n\nIs this correct?`,
          [
            { text: 'Edit', style: 'cancel' },
            { 
              text: 'Add', 
              onPress: () => {
                onAddFood(foodName.trim(), nutrition.calories, nutrition.protein);
                setFoodName('');
              }
            }
          ]
        );
      } else {
        // AI failed, ask for manual entry
        Alert.prompt(
          'Enter Nutrition',
          `We couldn't estimate nutrition for "${foodName}". Please enter calories and protein (format: "150,12"):`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Add', 
              onPress: (nutritionText?: string) => {
                const nutritionMatch = nutritionText?.match(/(\d+),(\d+)/);
                if (nutritionMatch) {
                  const calories = parseInt(nutritionMatch[1], 10);
                  const protein = parseInt(nutritionMatch[2], 10);
                  if (calories > 0 && calories <= 2000 && protein >= 0 && protein <= 200) {
                    onAddFood(foodName.trim(), calories, protein);
                    setFoodName('');
                  } else {
                    Alert.alert('Error', 'Please enter valid amounts (calories: 1-2000, protein: 0-200)');
                  }
                } else {
                  Alert.alert('Error', 'Please use format: "150,12" (calories,protein)');
                }
              }
            }
          ],
          'plain-text',
          '',
          'default'
        );
      }
    } catch (error) {
      console.error('Error adding food:', error);
      const errorMessage = handleFoodInputError(error);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter food item (e.g., chicken breast, apple, 2 eggs, pizza slice)"
          value={foodName}
          onChangeText={setFoodName}
          editable={!disabled && !isLoading}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleAddFood}
        />
        <TouchableOpacity
          style={[styles.button, (disabled || isLoading || !foodName.trim()) && styles.buttonDisabled]}
          onPress={handleAddFood}
          disabled={disabled || isLoading || !foodName.trim()}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Add</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <Text style={styles.helpText}>
        💡 AI-powered: Just type any food item and we'll estimate the calories!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#2c3e50',
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 12,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});