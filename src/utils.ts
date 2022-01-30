import { CodeSnippets } from '@/types/types';

export const validateSnippets = (text: string): CodeSnippets | null => {
  try {
    const obj = JSON.parse(text);
    if (typeof obj !== 'object') return null;

    const validated: CodeSnippets = {};

    for (const key of Object.keys(obj)) {
      const snippet = obj[key]?.snippet;
      if (!snippet || typeof snippet !== 'string') {
        console.log(`Failed to validate ${obj[key]}`);
        continue;
      }

      validated[key] = { snippet };
    }

    if (Object.keys(validated).length === 0) return null;

    return validated;
  } catch (e) {
    console.error(e);
    return null;
  }
};
