export interface Token {
  value: string | number;
  type?: string;
  description?: string;
  name?: string;
  [key: string]: any;
}

export interface TokenGroup {
  [key: string]: Token | TokenGroup;
}

export interface ProcessedTokens {
  [category: string]: TokenGroup;
}

export interface FileOptions {
  destination: string;
  format: string;
  options?: {
    showFileHeader?: boolean;
    fileHeader?: () => string[];
  };
}

export interface ProjectConfig {
  name: string;
  source: string[];
  platforms: {
    scss: {
      transformGroup: string;
      buildPath: string;
      files: FileOptions[];
    };
    css: {
      transformGroup: string;
      buildPath: string;
      files: FileOptions[];
    };
  };
}

export type ProjectName = 'global' | 'pr-dev' | 'pr-photo';

export interface BuildConfigs {
  [K in ProjectName]: ProjectConfig;
}
