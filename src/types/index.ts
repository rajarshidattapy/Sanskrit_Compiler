export interface CompilerResult {
  output: string;
  error?: string;
  pythonCode?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface LanguageExample {
  hindi: string;
  english: string;
  description: string;
  example: string;
}