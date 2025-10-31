# Free Fruit - Setup Guide

## 🚀 Quick Setup (5 Minutes)

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Expo CLI** (auto-installed with npm)

### Step 1: Install Dependencies
```bash
# In the project directory
npm install
```

### Step 2: Start Development Server
```bash
# Start for all platforms
npm start

# Or platform specific
npm run web     # Web browser
npm run ios     # iOS simulator
npm run android # Android emulator
```

### Step 3: Test on Your Phone
1. Download **Expo Go** app:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan QR code with your phone camera (iOS) or Expo Go app (Android)

## 🏗️ Build Commands

### Development
```bash
npm start           # Start development server
npm run web         # Start web development
npm run ios         # Start iOS simulator
npm run android     # Start Android emulator
```

### Production Builds
```bash
npm run build:web      # Build for web deployment
npm run build:ios      # Build iOS app (requires Apple Developer account)
npm run build:android  # Build Android app (requires Google Play account)
```

## 📱 Platform-Specific Setup

### Web Deployment
1. Build web version: `npm run build:web`
2. Deploy `dist/` folder to:
   - **Vercel**: Drag & drop `dist/` folder
   - **Netlify**: Connect GitHub repo for auto-deploy
   - **GitHub Pages**: Push `dist/` to gh-pages branch

### iOS App Store
1. Sign up for [Apple Developer Program](https://developer.apple.com/) ($99/year)
2. Build iOS: `npm run build:ios`
3. Upload to App Store Connect via Xcode or Transporter

### Google Play Store
1. Sign up for [Google Play Console](https://play.google.com/console/) ($25 one-time)
2. Build Android: `npm run build:android`
3. Upload to Google Play Console

## 🔧 Development Workflow

### Adding New Features
1. Edit `App.js` to add new screens/components
2. Test changes across platforms: `npm start`
3. Use Expo Developer Tools for debugging
4. Commit changes to Git

### Platform-Specific Code
```javascript
import { Platform } from 'react-native';

// Example: Different styling for web
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      web: { flexDirection: 'row' },
      default: { flexDirection: 'column' }
    })
  }
});
```

### Testing Changes
```bash
# Hot reload works on all platforms
# Changes to App.js auto-refresh in:
# - Web browser (auto-reload)
# - Mobile apps (shake device to reload)
```

## 🐛 Troubleshooting

### Common Issues

#### "Expo CLI not found"
```bash
npm install -g @expo/cli
npm start
```

#### Metro bundler errors
```bash
# Clear Metro cache
npx expo start --clear

# Reset everything
rm -rf node_modules
rm package-lock.json
npm install
```

#### AsyncStorage errors on web
```javascript
// Web uses localStorage automatically
// No additional setup needed
```

#### iOS simulator won't open
```bash
# Install Xcode from App Store
# Open Xcode and accept license agreements
# Run: npm run ios
```

#### Android emulator issues
```bash
# Install Android Studio
# Create virtual device in AVD Manager
# Run: npm run android
```

### Performance Issues
```bash
# Enable Hermes engine (faster JavaScript)
# Already configured in app.json

# Use Flipper for debugging
# Install Flipper desktop app
```

## 📦 Project Structure

```
free-fruit-unified/
├── App.js              # Main app logic
├── index.js            # Entry point
├── package.json        # Dependencies
├── babel.config.js     # Build config
├── assets/             # Images, icons
├── .gitignore         # Git ignore rules
└── README.md          # Documentation
```

## 🎯 Next Steps

1. **Customize branding**: Edit colors in `App.js` theme object
2. **Add real data**: Replace mock data with sports APIs
3. **Deploy web**: Build and deploy to free hosting (Vercel/Netlify)
4. **Mobile apps**: Set up Apple/Google developer accounts
5. **Analytics**: Add tracking and user feedback

## 💡 Pro Tips

### Development Speed
- Use `npm run web` for fastest development
- Web browser debugging is easier than mobile
- Test on actual devices before final deployment

### Production Optimization
- Use `expo export --platform web` for optimized web builds
- Enable Hermes engine for faster mobile performance
- Optimize images and reduce bundle size

### Code Organization
- Keep components small and reusable
- Use React Native's built-in APIs for cross-platform compatibility
- Avoid platform-specific libraries when possible

---

**Need help?** Check the troubleshooting section or open an issue on GitHub.