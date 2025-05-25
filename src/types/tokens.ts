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

export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  [key: string]: any;
}

export type CoreTokens = DesignTokens;

export interface ThemeTokens extends CoreTokens {
  [key: string]: any;
}

export type ThemeKey = 'pr-photo' | 'pr-dev' | 'pr-iskierka';

export interface ThemeMap {
  [key: string]: ThemeTokens;
}

export interface Tokens {
  core: CoreTokens;
  themes: ThemeMap;
}

export type OutputFormat = 'scss' | 'css' | 'js' | 'ts';
