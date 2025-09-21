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
  onAddFood: (name: string, calories: number) => void;
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
      const calories = await geminiClient.estimateCalories(foodName);

      if (calories !== null) {
        // Show confirmation with AI estimate
        Alert.alert(
          'Confirm Calories',
          `🤖 Estimated calories for "${foodName}": ${calories} cal\n\nIs this correct?`,
          [
            { text: 'Edit', style: 'cancel' },
            { 
              text: 'Add', 
              onPress: () => {
                onAddFood(foodName.trim(), calories);
                setFoodName('');
              }
            }
          ]
        );
      } else {
        // AI failed, ask for manual entry
        Alert.prompt(
          'Enter Calories',
          `We couldn't estimate calories for "${foodName}". Please enter the calories manually:`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Add', 
              onPress: (calorieText?: string) => {
                const validation = validateCalorieInput(calorieText || '');
                if (validation.isValid && validation.calories) {
                  onAddFood(foodName.trim(), validation.calories);
                  setFoodName('');
                } else {
                  Alert.alert('Error', validation.error || 'Please enter a valid calorie amount');
                }
              }
            }
          ],
          'plain-text',
          '',
          'numeric'
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