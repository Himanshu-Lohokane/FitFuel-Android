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
import { searchOfflineFood } from '../services/offlineFoods';

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
      let calories: number | null = null;
      let source = '';

      // First, try offline dictionary
      calories = searchOfflineFood(foodName);
      if (calories) {
        source = 'offline';
      } else {
        // Try Gemini API if available
        const hasApiKey = await geminiClient.hasApiKey();
        if (hasApiKey) {
          try {
            calories = await geminiClient.estimateCalories(foodName);
            source = 'gemini';
          } catch (error) {
            console.log('Gemini API failed, will ask for manual entry');
          }
        }
      }

      if (calories !== null) {
        // Show confirmation with estimated calories
        const message = source === 'gemini' 
          ? `Estimated calories for "${foodName}": ${calories} cal\n\nIs this correct?`
          : `Found "${foodName}" in our database: ${calories} cal\n\nIs this correct?`;
          
        Alert.alert(
          'Confirm Calories',
          message,
          [
            { text: 'Edit', style: 'cancel' },
            { 
              text: 'Add', 
              onPress: () => {
                onAddFood(foodName.trim(), calories!);
                setFoodName('');
              }
            }
          ]
        );
      } else {
        // No estimate available, ask for manual entry
        Alert.prompt(
          'Enter Calories',
          `We couldn't find "${foodName}" in our database. Please enter the calories manually:`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Add', 
              onPress: (calorieText) => {
                const calories = parseInt(calorieText || '0', 10);
                if (calories > 0 && calories <= 2000) {
                  onAddFood(foodName.trim(), calories);
                  setFoodName('');
                } else {
                  Alert.alert('Error', 'Please enter a valid calorie amount (1-2000)');
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
      Alert.alert('Error', 'Failed to add food item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter food item (e.g., apple, 2 slices of bread)"
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
        💡 Try: "apple", "chicken breast", "2 eggs", "1 cup rice"
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
