import { createContext, useContext } from 'react';

export type ThemeChoice = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  /** The user's chosen mode: light, dark, or follow-system. */
  theme: ThemeChoice;
  /** The actual applied theme after resolving "system". */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeChoice) => void;
  /** Cycles light -> dark -> system -> light. */
  cycleTheme: () => void;
}

export const THEME_STORAGE_KEY = 'tailblazer:theme';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
