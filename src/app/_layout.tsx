import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { WorkOrderProvider } from '@/context/WorkOrderContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <WorkOrderProvider>
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#F0F4FF' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="assign" />
        <Stack.Screen name="workorder/[id]" />
      </Stack>
    </WorkOrderProvider>
  );
}
