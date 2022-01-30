import { EditorView } from '@codemirror/view';

export type CodeSnippet = {
  snippet: string
};

export type CodeSnippets = {
  [key: string]: CodeSnippet
};

export const codeSnippetsKey = 'codeSnippets';

export type StoreType = {
  queryMode: boolean,
  customFields: string[],
  customFunctions: string[],
  codeSnippets: CodeSnippets,
  codemirrorView?: EditorView
};
