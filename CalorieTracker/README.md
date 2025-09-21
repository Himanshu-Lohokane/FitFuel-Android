# Simple Calorie Tracker

A lightweight, privacy-focused calorie tracking app built with React Native and Expo.

## Features

- **Simple Interface**: Clean, single-screen design focused on ease of use
- **Smart Calorie Estimation**: Uses Gemini AI API for automatic calorie estimation
- **Offline Mode**: Works without internet using a built-in database of common foods
- **Local Storage**: All data stored locally on your device - completely private
- **Manual Entry**: Easy manual calorie entry when needed
- **Daily Tracking**: Track your daily calorie intake with progress visualization
- **Data Management**: Edit or delete food entries with simple tap gestures

## Getting Started

### Prerequisites

- Node.js (v20.19.4 or higher recommended)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your mobile device (for testing)

### Installation

1. Navigate to the project directory:
   ```bash
   cd CalorieTracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Scan the QR code with Expo Go app on your phone to test the app.

### Gemini API Setup (Optional)

For automatic calorie estimation:

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/)
2. Open the app and tap the settings (⚙️) icon
3. Enter your Gemini API key
4. The app will test the connection automatically

**Note**: The app works perfectly without the API key using the offline food database.

## Usage

### Adding Food Items

1. Type the food item in the input field (e.g., "apple", "chicken breast", "2 slices of bread")
2. Tap "Add" button
3. The app will:
   - First check the offline database
   - If not found and API key is configured, ask Gemini AI
   - If still not found, ask you to enter calories manually
4. Confirm the estimated calories or edit as needed

### Managing Entries

- **Edit**: Tap any food item to edit its calorie amount
- **Delete**: Long press any food item to delete it
- **View Progress**: The top display shows your daily total and progress toward your goal

### Settings

- Configure your Gemini API key for AI-powered calorie estimation
- Set your daily calorie goal (default: 2000)
- View app information and privacy details

## Data Privacy

- **100% Local**: All your data is stored locally on your device
- **No Cloud Sync**: Your food entries never leave your phone
- **Automatic Cleanup**: Only keeps today and yesterday's data to minimize storage
- **No Tracking**: No analytics, no user accounts, no data collection

## Offline Food Database

The app includes a comprehensive database of common foods:

- **Fruits**: Apple (80 cal), Banana (105 cal), Orange (62 cal), etc.
- **Vegetables**: Carrot (25 cal), Broccoli (55 cal), Spinach (7 cal), etc.
- **Proteins**: Chicken breast (165 cal), Egg (70 cal), Salmon (206 cal), etc.
- **Grains**: Bread slice (70 cal), Rice cup (200 cal), Pasta cup (220 cal), etc.
- **Dairy**: Milk cup (150 cal), Cheese slice (113 cal), Yogurt cup (150 cal), etc.

## Technical Details

### Tech Stack
- **React Native** with Expo CLI
- **TypeScript** for type safety
- **AsyncStorage** for local data persistence
- **Expo SecureStore** for secure API key storage
- **Fetch API** for Gemini API requests

### Storage Structure
```json
{
  "2025-09-21": [
    {
      "id": "1234567890",
      "name": "apple",
      "calories": 80,
      "timestamp": "2025-09-21T10:30:00.000Z"
    }
  ]
}
```

### Data Retention
- Keeps only today and yesterday's data
- Automatic cleanup on app startup
- Maximum storage: ~2KB

## Building for Production

### Android APK
```bash
npx expo build:android
```

### iOS App
```bash
npx expo build:ios
```

## Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Go to Settings and enter your Gemini API key
   - Or use the app in offline mode (no API key needed)

2. **Food not found in database**
   - Try rephrasing (e.g., "chicken" instead of "chicken breast")
   - Enter calories manually when prompted

3. **App won't start**
   - Make sure you're in the CalorieTracker directory
   - Run `npm install` to ensure all dependencies are installed

### Performance Tips

- The app is optimized for minimal battery usage
- Data is automatically cleaned up to prevent storage bloat
- Offline mode is faster than API calls

## Contributing

This is a simple, focused app designed for personal use. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify as needed.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments for technical details
3. The app is designed to be self-contained and easy to understand

---

**Built with ❤️ for simple, private calorie tracking**
