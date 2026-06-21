import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useFonts } from "expo-font";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { View } from 'react-native';
import { FeedbackProvider } from '@/components/ui/feedback/feedbackProvider';
import "@/lib/i18n";
import { useSyncLocale } from '@/lib/i18n/useSyncLocale';
import { LocaleProvider } from '@/lib/i18n/LocaleProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useSyncLocale();

  const [loaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!loaded) {
    return <View />;
  }

  return (
    
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
       <LocaleProvider>
        <FeedbackProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </FeedbackProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}