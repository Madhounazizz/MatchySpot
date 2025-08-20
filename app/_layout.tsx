import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/useUserStore";

export const unstable_settings = {
  initialRouteName: "auth/login",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { isLoggedIn, isRestaurantUser } = useUserStore();

  return (
    <>
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
            {isRestaurantUser() ? (
              <Stack.Screen name="(restaurant)" options={{ headerShown: false }} />
            ) : (
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            )}
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
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </>
        )}
      </Stack>
    </>
  );
}