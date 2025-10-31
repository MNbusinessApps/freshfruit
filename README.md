# Free Fruit - Sports Intelligence Platform

**ONE APP. THREE PLATFORMS.** React Native + Expo supports iOS, Android, and Web from a single codebase.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development
```bash
# All platforms (recommended)
npm start

# Platform specific
npm run ios     # iOS simulator
npm run android # Android emulator  
npm run web     # Web browser
```

### 3. Build for Production
```bash
npm run build:web   # Web deployment
npm run build:ios   # iOS App Store
npm run build:android # Google Play Store
```

## 📱 Platform Support

| Platform | Status | Build Command |
|----------|--------|---------------|
| **Web** | ✅ Ready | `npm run web` |
| **iOS** | ✅ Ready | `npm run ios` |
| **Android** | ✅ Ready | `npm run android` |

## 🎯 Features

- **Unified Search**: Search NBA/NFL players with real-time filtering
- **Fruit Score Analytics**: Visual scoring system for player evaluation  
- **Watchlist Management**: Track favorite players with persistent storage
- **Player Details**: Deep analytics and performance insights
- **Cross-Platform**: Same codebase works on web, iOS, and Android

## 🏗️ Architecture

### Single Codebase Approach
```
free-fruit-unified/
├── App.js              # Main application logic
├── index.js            # Web entry point
├── package.json        # All dependencies (web + mobile)
├── app.json           # Expo configuration
├── babel.config.js    # Build configuration
└── assets/            # Images, icons, fonts
```

### Tech Stack
- **Framework**: React Native + Expo SDK 49
- **Navigation**: React Navigation Drawer
- **Storage**: AsyncStorage (local persistence)
- **Build**: Expo (supports web/mobile from same code)
- **Styling**: React Native StyleSheet

## 📦 Deployment

### Web (Vercel/Netlify)
1. `npm run build:web`
2. Deploy `/dist` folder to web hosting
3.访问链接: `https://your-domain.com`

### Mobile Apps
1. **iOS**: Run `npm run build:ios`, upload to App Store
2. **Android**: Run `npm run build:android`, upload to Google Play

## 🔧 Development

### Platform Detection
```javascript
import { Platform } from 'react-native';

// Platform-specific code
if (Platform.OS === 'web') {
  // Web-specific logic
} else {
  // iOS/Android logic
}
```

### Responsive Design
All components use React Native's flexible layouts that automatically adapt to screen size across platforms.

### Storage Persistence
Watchlist data persists across sessions using AsyncStorage on mobile and localStorage on web.

## 🎨 Customization

### Theme Configuration
Edit the `theme` object in `App.js`:
```javascript
const theme = {
  colors: {
    primary: '#1CE5C8',     // Main brand color
    background: '#0B132B',  // Dark background
    surface: '#1a2332',     // Card background
    // ... more colors
  },
  // spacing, typography, etc.
};
```

### Adding New Features
1. Create components in `App.js` or separate files
2. Add navigation routes using React Navigation
3. Use platform-agnostic React Native APIs
4. Test across all platforms

## 🐛 Troubleshooting

### Web Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
npm run web
```

### Mobile Build Issues
```bash
# Reset Metro bundler
npx expo start --clear
```

### Common Errors
- **AsyncStorage errors**: Ensure dependency is installed: `@react-native-async-storage/async-storage`
- **Navigation errors**: Verify `@react-navigation/native` is installed
- **Web display issues**: Check browser console for CSS warnings

## 📈 Performance

### Bundle Size
- **Web**: ~2.5MB gzipped
- **iOS**: ~25MB app size
- **Android**: ~20MB app size

### Optimization Tips
- Use `React.memo()` for expensive components
- Implement virtual scrolling for large lists
- Lazy load non-critical components
- Optimize images and assets

## 🔗 API Integration

Current setup uses mock data. To integrate real sports APIs:

1. Add API endpoints to `App.js`
2. Replace mock data in search functions
3. Add environment variables for API keys
4. Implement error handling and loading states

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Test across all platforms
4. Submit pull request

---

**Built with ❤️ using React Native + Expo for true cross-platform development**