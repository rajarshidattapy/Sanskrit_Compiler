import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your environment variables.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export class GeminiService {
  private model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async translateAndExecute(indicCode: string): Promise<{ output: string; error?: string; pythonCode?: string }> {
    if (!this.model) {
      return {
        output: '',
        error: 'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.',
        pythonCode: ''
      };
    }

    try {
      const prompt = `
You are a code translator and executor that converts natural language code (written in English script with Hindi/Sanskrit words) into Python code and executes it.

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
- "ke liye" or "के लिए" → for loop
- "range" or "रेंज" → range()
- "list" or "सूची" → list
- "dictionary" or "शब्दकोश" → dict
- "function" or "फंक्शन" → def
- "return" or "वापस" → return
- "try" or "कोशिश" → try
- "except" or "अपवाद" → except
- "finally" or "अंततः" → finally
- "import" or "आयात" → import
- "class" or "कक्षा" → class
- "self" or "स्वयं" → self

Instructions:
1. First, translate the natural language code to valid Python code
2. Then execute the Python code and capture the output
3. Return the result in this exact format:
   PYTHON_CODE: [the translated Python code]
   OUTPUT: [the execution output]
   ERROR: [any error message, or "None" if no error]

Convert and execute this natural language code:

${indicCode}
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const fullResponse = response.text().trim();

      // Parse the response to extract Python code, output, and error
      const pythonCodeMatch = fullResponse.match(/PYTHON_CODE:\s*([\s\S]*?)(?=OUTPUT:|ERROR:|$)/);
      const outputMatch = fullResponse.match(/OUTPUT:\s*([\s\S]*?)(?=ERROR:|$)/);
      const errorMatch = fullResponse.match(/ERROR:\s*([\s\S]*?)$/);

      const pythonCode = pythonCodeMatch ? pythonCodeMatch[1].trim() : '';
      const output = outputMatch ? outputMatch[1].trim() : '';
      const error = errorMatch ? errorMatch[1].trim() : '';

      return {
        output: error === 'None' ? output : '',
        error: error === 'None' ? undefined : error,
        pythonCode: pythonCode
      };
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        pythonCode: ''
      };
    }
  }

  async getChatResponse(userMessage: string): Promise<string> {
    if (!this.model) {
      return 'Sorry, I need a Gemini API key to help you. Please configure VITE_GEMINI_API_KEY in your environment variables.';
    }

    try {
      const prompt = `
You are a helpful assistant for the Natural Language to Python programming system. This system allows you to write code using natural language with Hindi/Sanskrit words written in English script, which gets translated to Python and executed.

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
- "ke liye" (के लिए) - for loop
- "range" (रेंज) - range function
- "list" (सूची) - list data structure
- "dictionary" (शब्दकोश) - dictionary data structure
- "function" (फंक्शन) - function definition
- "return" (वापस) - return statement
- "try" (कोशिश) - try block
- "except" (अपवाद) - except block
- "import" (आयात) - import statement
- "class" (कक्षा) - class definition

The system supports full Python syntax including:
- All control structures (if/elif/else, for, while)
- Functions and classes
- Lists, dictionaries, and other data structures
- List comprehensions and lambda functions
- Exception handling
- All Python standard library features

User question: ${userMessage}

Provide a helpful response about natural language programming. Include examples when relevant. Keep responses concise and practical.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      return `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
}