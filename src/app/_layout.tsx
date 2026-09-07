import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {
  useFonts,
  Mulish_400Regular,
  Mulish_600SemiBold,
  Mulish_700Bold,
  Mulish_800ExtraBold,
} from '@expo-google-fonts/mulish';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { WorkOrderProvider } from '@/context/WorkOrderContext';

SplashScreen.preventAutoHideAsync();

// ─── Auth Guard ───────────────────────────────────────────────────────────────
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const onAuthScreen = (segments[0] as string) === 'login';
    if (!isLoggedIn && !onAuthScreen) {
      router.replace('/login' as any);
    } else if (isLoggedIn && onAuthScreen) {
      router.replace('/');
    }
  }, [isLoggedIn, segments]);

  return <>{children}</>;
}
// ─────────────────────────────────────────────────────────────────────────────

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Mulish_400Regular,
    Mulish_600SemiBold,
    Mulish_700Bold,
    Mulish_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <WorkOrderProvider>
        <AuthGuard>
          <Stack
            initialRouteName="login"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: '#F4F6F9' },
            }}
          >
            <Stack.Screen name="login" />
            <Stack.Screen name="index" />
            <Stack.Screen name="assign" />
            <Stack.Screen name="workorder/[id]" />
          </Stack>
        </AuthGuard>
      </WorkOrderProvider>
    </AuthProvider>
  );
}

