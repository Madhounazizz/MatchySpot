import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, ActivityIndicator } from "react-native";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/useUserStore";
import { BRCChatProvider } from "@/store/useBRCChatStore";
import { LanguageProvider } from "@/store/useLanguageStore";
import { TokenProvider } from "@/store/useTokenStore";
import ErrorBoundary from "@/components/ErrorBoundary";


export const unstable_settings = {
  initialRouteName: "auth/login",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  const [timeoutError, setTimeoutError] = useState(false);

  // Set a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded && !error) {
        console.log('Font loading timeout - proceeding anyway');
        setTimeoutError(true);
      }
    }, 3000); // 3 second timeout

    return () => clearTimeout(timer);
  }, [loaded, error]);

  useEffect(() => {
    if (error) {
      console.error('Font loading error:', error);
      // Continue anyway instead of throwing
      SplashScreen.hideAsync().catch(e => console.log('Error hiding splash:', e));
    }
  }, [error]);

  useEffect(() => {
    if (loaded || timeoutError) {
      SplashScreen.hideAsync().catch(e => console.log('Error hiding splash:', e));
    }
  }, [loaded, timeoutError]);

  if (!loaded && !timeoutError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { isLoggedIn } = useUserStore();

  return (
    <LanguageProvider>
      <TokenProvider>
        <BRCChatProvider>
          <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.white,
          },

          headerShadowVisible: true,
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 20,
            letterSpacing: 0.3,
            color: colors.text,
          },
          headerBackTitleVisible: false,
          contentStyle: {
            backgroundColor: colors.white,
          },
          animation: 'slide_from_right',
        }}
      >
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(restaurant)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="brc/[id]" 
              options={{ 
                title: "Place Details",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="booking/index" 
              options={{ 
                title: "Book a Place",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="booking/success" 
              options={{ 
                title: "Booking Confirmed",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="events/[id]" 
              options={{ 
                title: "Event Details",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="chat/[id]" 
              options={{ 
                title: "Conversation",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="reviews/index" 
              options={{ 
                title: "Reviews",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="wallet/index" 
              options={{ 
                title: "My Wallet",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="invite/index" 
              options={{ 
                title: "Invite Friends",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="brc/chatroom/[brcId]" 
              options={{ 
                title: "Chatroom",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="menu/[brcId]" 
              options={{ 
                title: "Menu",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="qr-scanner" 
              options={{ 
                title: "QR Scanner",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="test-qr" 
              options={{ 
                title: "Test QR",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </>
        )}
        </Stack>
        </BRCChatProvider>
      </TokenProvider>
    </LanguageProvider>
  );
}