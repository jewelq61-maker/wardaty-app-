import AsyncStorage from '@react-native-async-storage/async-storage';

async function resetOnboarding() {
  try {
    await AsyncStorage.removeItem('onboardingComplete');
    await AsyncStorage.removeItem('appData');
    console.log('✅ Onboarding reset complete! Restart the app to see onboarding.');
  } catch (error) {
    console.error('Error resetting onboarding:', error);
  }
}

resetOnboarding();
