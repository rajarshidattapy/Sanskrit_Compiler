import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your environment variables.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export class GeminiService {
  private model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async translateToPython(indicCode: string): Promise<{ pythonCode: string; error?: string }> {
    if (!this.model) {
      return {
        pythonCode: '',
        error: 'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.'
      };
    }

    try {
      const prompt = `
You are a code translator that converts Indic-style pseudo-code (written in English script with Hindi/Sanskrit words) into valid Python code.

Translation Rules:
- "chhapo" or "छापो" → print()
- "yadi" or "यदि" → if
- "jab tak" or "जब तक" → while  
- "adala badli" or "अदला बदली" → swap variables (a, b = b, a)
- "ganana" or "गणना" → counter/count variable
- "bada hai" or "बड़ा है" → "is big" or "is greater"
- "chota hai" or "छोटा है" → "is small" or "is less"
- "barabar hai" or "बराबर है" → "is equal"
- "khatam" or "खत्म" → end/break
- "shuru" or "शुरू" → start/begin
- "agar" or "अगर" → if (alternative)
- "phir" or "फिर" → then/else
- "aur" or "और" → and
- "ya" or "या" → or

Convert this IndicLang code to Python. Only return valid Python code, no explanations:

${indicCode}
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const pythonCode = response.text().trim();

      return { pythonCode };
    } catch (error) {
      return {
        pythonCode: '',
        error: `Translation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async getChatResponse(userMessage: string): Promise<string> {
    if (!this.model) {
      return 'Sorry, I need a Gemini API key to help you. Please configure VITE_GEMINI_API_KEY in your environment variables.';
    }

    try {
      const prompt = `
You are a helpful assistant for the IndicLang programming language. IndicLang uses Hindi/Sanskrit words written in English script to write code.

Here are the main keywords and their meanings:
- "chhapo" (छापो) - print/display output
- "yadi" (यदि) - if condition
- "jab tak" (जब तक) - while loop
- "adala badli" (अदला बदली) - swap two variables
- "ganana" (गणना) - counter/count
- "bada hai" (बड़ा है) - is greater than
- "chota hai" (छोटा है) - is less than
- "barabar hai" (बराबर है) - is equal to
- "khatam" (खत्म) - end/break
- "shuru" (शुरू) - start/begin
- "agar" (अगर) - if (alternative)
- "phir" (फिर) - then/else
- "aur" (और) - and
- "ya" (या) - or

User question: ${userMessage}

Provide a helpful response about IndicLang programming. Include examples when relevant. Keep responses concise and practical.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      return `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
}