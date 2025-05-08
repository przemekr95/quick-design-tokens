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

// Dodajemy typ DesignTokens, którego brakowało
export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borderRadius: BorderRadius;
  boxShadow: BoxShadow;
  [key: string]: any;
}

// Główny typ tokenów
export type CoreTokens = DesignTokens;

// Typ dla tematów - dziedziczy po CoreTokens, ale może zawierać dodatkowe tokeny
export interface ThemeTokens extends CoreTokens {
  [key: string]: any; // Pozwala na dodawanie nowych tokenów w motywach, których nie ma w core
}

// Klucze tematów
export type ThemeKey = 'pr-photo' | 'pr-dev';

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
