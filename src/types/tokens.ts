// src/types/tokens.ts

// Podstawowe typy tokenów
export interface ColorTokens {
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  light: string;
  dark: string;
  [key: string]: string;
}

export interface TypographyTokens {
  fontFamily: {
    base: string;
    heading: string;
    monospace: string;
    [key: string]: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    [key: string]: string;
  };
  fontWeight: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
    [key: string]: number;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
    [key: string]: string;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
    [key: string]: string;
  };
  [key: string]: any;
}

export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  [key: string]: string;
}

export interface BorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  full: string;
  [key: string]: string;
}

export interface BoxShadow {
  none: string;
  sm: string;
  md: string;
  lg: string;
  [key: string]: string;
}

// Główny typ tokenów
export interface CoreTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borderRadius: BorderRadius;
  boxShadow: BoxShadow;
  [key: string]: any;
}

// Typ dla tematów - dziedziczy po CoreTokens
export type ThemeTokens = CoreTokens;

// Klucze tematów
export type ThemeKey = 'prPhoto' | 'prDev';

// Mapa tematów
export interface ThemeMap {
  [key: string]: ThemeTokens;
}

// Główny typ eksportowy
export interface Tokens {
  core: CoreTokens;
  themes: ThemeMap;
}

// Typ dla formatu wyjściowego
export type OutputFormat = 'scss' | 'css' | 'js' | 'ts';
