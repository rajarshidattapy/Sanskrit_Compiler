# Sanskrit Compiler

A web-based compiler that lets you writes code using natural language with Hindi/Sanskrit keywords. The system uses Gemini AI to translate your natural language code to Python and execute it.

## Features

- **Full Python Support**: All Python syntax including functions, classes, lists, dictionaries, etc.
- **Natural Language Keywords**: Write code using Hindi/Sanskrit words in English script
- **AI-Powered Execution**: Gemini AI handles both translation and execution
- **No Backend Required**: Everything runs in the browser using AI

## Usage

Write code using these keywords:
- `chhapo` - print output
- `yadi` - if condition  
- `jab tak` - while loop
- `ke liye` - for loop
- `adala badli` - swap variables
- `function` - define function
- `return` - return statement
- `list` - list data structure
- `dictionary` - dictionary data structure
- And many more Python features!

## Examples

### Basic Operations
```
a = 5
b = 10
adala badli (a, b)
chhapo a
chhapo b
```

### For Loops
```
ke liye i range(5):
    chhapo i
```

### Functions
```
function add_numbers(a, b):
    return a + b

result = add_numbers(5, 3)
chhapo result
```

### Lists and Iteration
```
numbers = [1, 2, 3, 4, 5]
ke liye num numbers:
    chhapo num
```

## Setup

1. Clone the repo
2. Run `npm install`
3. Add your Gemini API key to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
4. Run `npm run dev`

## How It Works

1. **Natural Language Input**: You write code using natural language with Hindi/Sanskrit keywords
2. **AI Translation & Execution**: Gemini AI translates your code to Python and executes it
3. **Output Display**: Results are displayed in the web interface

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **AI Execution**: Google Gemini AI
- **Styling**: Tailwind CSS
