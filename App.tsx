import React from 'react';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import { StatusBar } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from 'styled-components';
import theme from './src/styles/theme';

import AppLoading from 'expo-app-loading';
import { Routes } from './src/routes/index';
import { AuthProvider, useAuth } from './src/hooks/auth'

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const { userStorageLoading } = useAuth();

  if(!fontsLoaded || userStorageLoading) {
    return <AppLoading />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <StatusBar barStyle='light-content' />
          <AuthProvider>
            <Routes />
          </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
