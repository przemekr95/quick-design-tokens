import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

interface Token {
  value: string | number;
  type?: string;
  description?: string;
  name?: string;
  [key: string]: any;
}

interface TokenGroup {
  [key: string]: Token | TokenGroup;
}

interface ProcessedTokens {
  [category: string]: TokenGroup;
}

export async function preprocessTokens(sourcePaths: string[]): Promise<ProcessedTokens> {
  const processedTokens: ProcessedTokens = {};
  
  for (const sourcePath of sourcePaths) {
    const files = await glob(sourcePath);
    
    await Promise.all(files.map(async (filePath) => {
      const category = path.basename(filePath, '.json');
      const fileContent = await fs.readJson(filePath);
      
      processedTokens[category] = processedTokens[category] 
        ? deepMerge(processedTokens[category], fileContent)
        : fileContent;
    }));
  }
  
  return postprocessTokens(processedTokens);
}

function deepMerge(target: TokenGroup, source: TokenGroup): TokenGroup {
  const result = { ...target };
  
  Object.entries(source).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !isToken(value)) {
      result[key] = deepMerge((result[key] as TokenGroup) || {}, value as TokenGroup);
    } else {
      result[key] = value;
    }
  });
  
  return result;
}

function isToken(obj: any): obj is Token {
  return obj && typeof obj === 'object' && 'value' in obj;
}

function postprocessTokens(tokens: ProcessedTokens): ProcessedTokens {
  return Object.fromEntries(
    Object.entries(tokens).map(([category, tokenGroup]) => [
      category,
      processTokenGroup(tokenGroup, category)
    ])
  );
}

function processTokenGroup(tokenGroup: TokenGroup, category: string, parentPath: string[] = []): TokenGroup {
  return Object.fromEntries(
    Object.entries(tokenGroup).map(([key, value]) => {
      const currentPath = [...parentPath, key];
      
      return [
        key,
        isToken(value) 
          ? processToken(value, currentPath, category)
          : processTokenGroup(value as TokenGroup, category, currentPath)
      ];
    })
  );
}

function processToken(token: Token, path: string[], category: string): Token {
  const processed: Token = {
    ...token,
    name: token.name || path.join('-'),
    description: token.description || `${category} token: ${path.join(' ')}`
  };
  
  const normalizers: Record<string, (value: any, path: string[]) => any> = {
    color: normalizeColorValue,
    font: (value, path) => normalizeFontValue(value, path)
  };
  
  if (normalizers[category]) {
    processed.value = normalizers[category](processed.value, path);
  }
  
  return processed;
}

function normalizeColorValue(value: string): string {
  if (value.startsWith('#')) return value.toLowerCase();
  if (value.includes('rgba') || value.includes('hsla')) {
    return value.replace(/\s+/g, ' ').trim();
  }
  return value;
}

function normalizeFontValue(value: string | number, path: string[]): string | number {
  const lastSegment = path[path.length - 1];

  const fontNormalizers: Record<string, (v: any) => any> = {
    fontSize: (v) => typeof v === 'number' ? `${v}px` : v,
    lineHeight: (v) => typeof v === 'number' ? `${v}px` : v,
    size: (v) => typeof v === 'number' ? `${v}rem` : v,
    family: (v) => typeof v === 'string' ? v.replace(/([^,\s'"]+\s+[^,\s'"]+)/g, "'$1'") : v
  };
  
  return fontNormalizers[lastSegment]?.(value) ?? value;
}
