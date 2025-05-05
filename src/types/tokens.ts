// src/types/tokens.ts

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

export interface FontFamily {
  base: string;
  heading: string;
  monospace: string;
  [key: string]: string;
}

export interface FontSize {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  [key: string]: string;
}

export interface FontWeight {
  light: number;
  regular: number;
  medium: number;
  semibold: number;
  bold: number;
  [key: string]: number;
}

export interface TypographyTokens {
  fontFamily: FontFamily;
  fontSize: FontSize;
  fontWeight: FontWeight;
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

export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borderRadius: BorderRadius;
  boxShadow: BoxShadow;
  [key: string]: any;
}

// Dodajemy typ dla kluczy projektów
export type ProjectKey = 'prPhoto' | 'prDev';

export interface DesignTokensWithProjects extends DesignTokens {
  projects: {
    [key in ProjectKey]: DesignTokens;
  };
}
