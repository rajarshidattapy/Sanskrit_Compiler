import React, { useState } from 'react';
import { Play, Code, Sparkles, Brain, Zap } from 'lucide-react';
import { GeminiService } from './services/geminiService';
import { PythonInterpreter } from './services/pythonInterpreter';
import { ChatBot } from './components/ChatBot';
import { CompilerResult } from './types';

function App() {
  const [code, setCode] = useState('a = 5\nb = 10\nadala badli (a, b)\nchhapo a\nchhapo b');
  const [result, setResult] = useState<CompilerResult>({ output: '' });
  const [isRunning, setIsRunning] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showPythonCode, setShowPythonCode] = useState(false);

  const geminiService = new GeminiService();
  const pythonInterpreter = new PythonInterpreter();

  const executeCode = async () => {
    setIsRunning(true);
    try {
      // Step 1: Use Gemini AI to translate IndicLang to Python
      const translation = await geminiService.translateToPython(code);
      
      if (translation.error) {
        setResult({ 
          output: '', 
          error: translation.error,
          pythonCode: ''
        });
        return;
      }

      // Step 2: Execute the Python code using our interpreter
      const execution = pythonInterpreter.execute(translation.pythonCode);
      
      setResult({
        output: execution.output,
        error: execution.error,
        pythonCode: translation.pythonCode
      });
    } catch (error) {
      setResult({ 
        output: '', 
        error: error instanceof Error ? error.message : 'Execution error',
        pythonCode: ''
      });
    }
    setIsRunning(false);
  };

  const examples = [
    {
      title: "Variable Swap",
      code: "a = 5\nb = 10\nadala badli (a, b)\nchhapo a\nchhapo b",
      description: "Swap two variables using 'adala badli'"
    },
    {
      title: "Conditional Logic",
      code: "x = 12\nyadi x > 10:\n    chhapo 'bada hai'\nphir:\n    chhapo 'chota hai'",
      description: "Use 'yadi' for if conditions"
    },
    {
      title: "Loop Counter",
      code: "ganana = 0\njab tak ganana < 3:\n    chhapo ganana\n    ganana = ganana + 1",
      description: "Create loops with 'jab tak'"
    },
    {
      title: "Sanskrit Style",
      code: "संख्या = 7\nयदि संख्या > 5:\n    छापो 'बड़ी संख्या'\nअन्यथा:\n    छापो 'छोटी संख्या'",
      description: "Use Devanagari script directly"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Sanskrit Compiler
                </h1>
                <p className="text-gray-600 mt-1">Sanskrit-Hindi-English Code Interpreter</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Code Editor - Takes 2 columns */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  IndicLang Code Editor
                </h2>
                <p className="text-orange-100 text-sm mt-1">Write in Hindi, Sanskrit, or English script</p>
              </div>
              
              <div className="p-6">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-80 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  placeholder="Enter your IndicLang code here... (e.g., chhapo 'Hello World')"
                />
                
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={executeCode}
                    disabled={isRunning}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                  >
                    {isRunning ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                    {isRunning ? 'AI Processing...' : 'Run'}
                  </button>
                  
                  {result.pythonCode && (
                    <button
                      onClick={() => setShowPythonCode(!showPythonCode)}
                      className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center gap-2"
                    >
                      <Code className="w-4 h-4" />
                      {showPythonCode ? 'Hide' : ''} 
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Python Code Display */}
            {showPythonCode && result.pythonCode && (
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Generated Python Code
                  </h3>
                </div>
                <div className="p-6">
                  <pre className="bg-gray-900 text-green-400 font-mono text-sm rounded-lg p-4 overflow-x-auto">
                    {result.pythonCode}
                  </pre>
                </div>
              </div>
            )}

            {/* Examples */}
            <div className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-100 to-red-100 px-6 py-3 border-b border-orange-200">
                <h3 className="font-semibold text-gray-800">Example Code Patterns</h3>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setCode(example.code)}
                    className="text-left p-4 rounded-lg hover:bg-orange-50 transition-colors duration-200 border border-transparent hover:border-orange-200 group"
                  >
                    <div className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                      {example.title}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{example.description}</div>
                    <div className="text-xs text-gray-500 font-mono mt-2 bg-gray-50 p-2 rounded">
                      {example.code.split('\n')[0]}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output Panel - Takes 1 column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
                <h2 className="text-white font-semibold">Program Output</h2>
                <p className="text-green-100 text-sm mt-1">Live execution results</p>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-900 text-green-400 font-mono text-sm rounded-lg p-4 min-h-80 whitespace-pre-wrap">
                  {result.error ? (
                    <span className="text-red-400">❌ Error: {result.error}</span>
                  ) : result.output ? (
                    <>
                      <span className="text-blue-400">✅ Output:</span>
                      <br />
                      {result.output}
                    </>
                  ) : (
                    <span className="text-gray-500">🚀 Run your IndicLang code to see AI-powered results...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 border-b border-purple-200">
                <h3 className="font-semibold text-gray-800">Quick Reference</h3>
                <p className="text-sm text-gray-600 mt-1">Common IndicLang keywords</p>
              </div>
              <div className="p-6 space-y-3">
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { hindi: 'chhapo', english: 'print()', desc: 'Display output' },
                    { hindi: 'yadi', english: 'if', desc: 'Conditional' },
                    { hindi: 'jab tak', english: 'while', desc: 'Loop' },
                    { hindi: 'adala badli', english: 'swap', desc: 'Exchange values' },
                    { hindi: 'ganana', english: 'count', desc: 'Counter variable' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                      <code className="text-orange-600 font-mono font-semibold">{item.hindi}</code>
                      <span className="text-gray-500">→</span>
                      <span className="text-gray-700">{item.desc}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 Need help? Click the chat button to ask our AI guide about any IndicLang concepts!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ChatBot */}
      <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
}

export default App;