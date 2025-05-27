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

/**
 * Przetwarza tokeny przed przekazaniem do Style Dictionary
 * - Łączy pliki z różnych źródeł
 * - Normalizuje nazwy tokenów
 * - Dodaje metadane
 * - Rozwiązuje referencje
 */
export async function preprocessTokens(sourcePaths: string[]): Promise<ProcessedTokens> {
  const processedTokens: ProcessedTokens = {};
  
  for (const sourcePath of sourcePaths) {
    const files = await glob(sourcePath);
    
    for (const filePath of files) {
      const fileName = path.basename(filePath, '.json');
      const fileContent = await fs.readJson(filePath);
      
      // Określ kategorię na podstawie nazwy pliku
      const category = fileName; // 'color', 'font', etc.
      
      if (!processedTokens[category]) {
        processedTokens[category] = {};
      }
      
      // Połącz tokeny z różnych źródeł
      processedTokens[category] = deepMerge(processedTokens[category], fileContent);
    }
  }
  
  // Postprocess tokenów
  return postprocessTokens(processedTokens);
}

/**
 * Głębokie łączenie obiektów tokenów
 */
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

/**
 * Sprawdza czy obiekt jest tokenem (ma właściwość 'value')
 */
function isToken(obj: any): obj is Token {
  return obj && typeof obj === 'object' && 'value' in obj;
}

/**
 * Post-processing tokenów
 * - Normalizuje nazwy
 * - Dodaje metadane
 * - Rozwiązuje referencje
 */
function postprocessTokens(tokens: ProcessedTokens): ProcessedTokens {
  const processed: ProcessedTokens = {};
  
  for (const [category, tokenGroup] of Object.entries(tokens)) {
    processed[category] = processTokenGroup(tokenGroup, category);
  }
  
  return processed;
}

/**
 * Przetwarza grupę tokenów
 */
function processTokenGroup(tokenGroup: TokenGroup, category: string, parentPath: string[] = []): TokenGroup {
  const processed: TokenGroup = {};
  
  for (const [key, value] of Object.entries(tokenGroup)) {
    const currentPath = [...parentPath, key];
    
    if (isToken(value)) {
      // Przetwórz pojedynczy token
      processed[key] = processToken(value, currentPath, category);
    } else {
      // Rekurencyjnie przetwórz zagnieżdżoną grupę
      processed[key] = processTokenGroup(value as TokenGroup, category, currentPath);
    }
  }
  
  return processed;
}

/**
 * Przetwarza pojedynczy token
 */
function processToken(token: Token, path: string[], category: string): Token {
  const processed: Token = { ...token };
  
  // Dodaj metadata
  processed.path = path;
  processed.category = category;
  
  // Generuj nazwę CSS custom property
  processed.name = path.join('-');
  
  // Dodaj opis jeśli nie istnieje
  if (!processed.description) {
    processed.description = `${category} token: ${path.join(' ')}`;
  }
  
  // Normalizuj wartości kolorów
  if (category === 'color' && typeof processed.value === 'string') {
    processed.value = normalizeColorValue(processed.value);
  }
  
  // Normalizuj wartości czcionek
  if (category === 'font') {
    processed.value = normalizeFontValue(processed.value, path);
  }
  
  return processed;
}

/**
 * Normalizuje wartości kolorów
 */
function normalizeColorValue(value: string): string {
  // Zamień hex na lowercase
  if (value.startsWith('#')) {
    return value.toLowerCase();
  }
  
  // Normalizuj rgba/hsla
  if (value.includes('rgba') || value.includes('hsla')) {
    return value.replace(/\s+/g, ' ').trim();
  }
  
  return value;
}

/**
 * Normalizuje wartości czcionek
 */
function normalizeFontValue(value: string | number, path: string[]): string | number {
  const lastPathSegment = path[path.length - 1];
  
  // Dodaj jednostki do rozmiarów czcionek jeśli brakuje
  if (lastPathSegment === 'size' && typeof value === 'number') {
    return `${value}rem`;
  }
  
  // Normalizuj rodziny czcionek
  if (lastPathSegment === 'family' && typeof value === 'string') {
    // Upewnij się, że nazwy z spacjami są w cudzysłowach
    return value.replace(/([^,\s]+\s+[^,\s]+)/g, "'$1'");
  }
  
  return value;
}

/**
 * Resolves token references (np. {color.primary.500})
 * TODO: Implementuj w przyszłości dla bardziej zaawansowanych referencji
 */
function resolveReferences(tokens: ProcessedTokens): ProcessedTokens {
  // Placeholder dla przyszłej implementacji
  return tokens;
}

export { processTokenGroup, processToken };
