import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AppStateProvider } from '@/context/AppStateContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ClerkLoaded, ClerkProvider, useClerk } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { setAuthTokenGetter, setBaseUrl } from '@/lib/api';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
const domain = process.env.EXPO_PUBLIC_DOMAIN;
const apiUrl = process.env.EXPO_PUBLIC_API_URL || (domain ? `https://${domain}` : '');
if (apiUrl) setBaseUrl(apiUrl);

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const proxyUrl = process.env.EXPO_PUBLIC_CLERK_PROXY_URL || undefined;

function AuthTokenBridge() {
  const clerk = useClerk();

  useEffect(() => {
    // Read the live session at call time so a request made right after sign-up still has a token.
    setAuthTokenGetter(async () => (clerk.session ? await clerk.session.getToken() : null));
  }, [clerk]);

  return null;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  if (!publishableKey) throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache} proxyUrl={proxyUrl}>
      <ClerkLoaded>
        <SafeAreaProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <QueryClientProvider client={queryClient}>
                <AuthTokenBridge />
                <AppStateProvider>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <KeyboardProvider>
                      <RootLayoutNav />
                    </KeyboardProvider>
                  </GestureHandlerRootView>
                </AppStateProvider>
              </QueryClientProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </SafeAreaProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
