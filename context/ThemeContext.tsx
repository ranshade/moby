import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  themeMode: ThemeMode;
  activeScheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => Promise<void>;
};

const THEME_KEY = '@moby/theme-mode';
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((savedMode) => {
      if (savedMode === 'system' || savedMode === 'light' || savedMode === 'dark') {
        setThemeModeState(savedMode);
      }
    });
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await AsyncStorage.setItem(THEME_KEY, mode);
  };

  const activeScheme = themeMode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themeMode;
  const value = useMemo(() => ({ themeMode, activeScheme, setThemeMode }), [themeMode, activeScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}