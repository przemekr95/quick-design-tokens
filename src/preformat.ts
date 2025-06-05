import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

interface Token {
  value: string | number;
  type?: string;
  description?: string;
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
    
    for (const filePath of files) {
      const fileName = path.basename(filePath, '.json');
      const fileContent = await fs.readJson(filePath);
      
      const category = fileName;
      
      if (!processedTokens[category]) {
        processedTokens[category] = {};
      }

      processedTokens[category] = deepMerge(processedTokens[category], fileContent);
    }
  }
  
  return postprocessTokens(processedTokens);
}

function deepMerge(target: TokenGroup, source: TokenGroup): TokenGroup {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !isToken(source[key])) {
      result[key] = deepMerge(result[key] as TokenGroup || {}, source[key] as TokenGroup);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

function isToken(obj: any): obj is Token {
  return obj && typeof obj === 'object' && 'value' in obj;
}

function postprocessTokens(tokens: ProcessedTokens): ProcessedTokens {
  const processed: ProcessedTokens = {};
  
  for (const [category, tokenGroup] of Object.entries(tokens)) {
    processed[category] = processTokenGroup(tokenGroup, category);
  }
  
  return processed;
}

function processTokenGroup(tokenGroup: TokenGroup, category: string, parentPath: string[] = []): TokenGroup {
  const processed: TokenGroup = {};
  
  for (const [key, value] of Object.entries(tokenGroup)) {
    const currentPath = [...parentPath, key];
    
    if (isToken(value)) {
      processed[key] = processToken(value, currentPath, category);
    } else {
      processed[key] = processTokenGroup(value as TokenGroup, category, currentPath);
    }
  }
  
  return processed;
}

function processToken(token: Token, path: string[], category: string): Token {
  const processed: Token = { ...token };
  
  if (!processed.name) {
    processed.name = path.join('-');
  }
  
  if (!processed.description) {
    processed.description = `${category} token: ${path.join(' ')}`;
  }

  if (category === 'color' && typeof processed.value === 'string') {
    processed.value = normalizeColorValue(processed.value);
  }

  if (category === 'font') {
    processed.value = normalizeFontValue(processed.value, path);
  }
  
  return processed;
}

function normalizeColorValue(value: string): string {

  if (value.startsWith('#')) {
    return value.toLowerCase();
  }

  if (value.includes('rgba') || value.includes('hsla')) {
    return value.replace(/\s+/g, ' ').trim();
  }
  
  return value;
}

function normalizeFontValue(value: string | number, path: string[]): string | number {
  if (path.length === 0) return value;
  
  const lastPathSegment = path[path.length - 1];

  if (lastPathSegment === 'fontSize' || lastPathSegment === 'lineHeight') {
    if (typeof value === 'string' && value.includes('px')) {
      return value;
    }
    if (typeof value === 'number') {
      return `${value}px`;
    }
  }

  if (lastPathSegment === 'size' && typeof value === 'number') {
    return `${value}rem`;
  }

  if (lastPathSegment === 'family' && typeof value === 'string') {
    return value.replace(/([^,\s'"]+\s+[^,\s'"]+)/g, "'$1'");
  }
  
  return value;
}

export { processTokenGroup, processToken };
