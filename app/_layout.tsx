import { Stack } from "expo-router";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/useUserStore";
import { BRCChatProvider } from "@/store/useBRCChatStore";
import { LanguageProvider } from "@/store/useLanguageStore";
import { TokenProvider } from "@/store/useTokenStore";
import ErrorBoundary from "@/components/ErrorBoundary";
import SplashScreenComponent from "@/components/SplashScreen";


export const unstable_settings = {
  initialRouteName: "auth/login",
};

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreenComponent onFinish={() => setShowSplash(false)} />;
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