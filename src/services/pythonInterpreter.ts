export class PythonInterpreter {
  private variables: { [key: string]: any } = {};
  private output: string[] = [];

  execute(pythonCode: string): { output: string; error?: string } {
    try {
      this.variables = {};
      this.output = [];
      
      const lines = pythonCode.split('\n');
      this.executeLines(lines);
      
      return { output: this.output.join('\n') };
    } catch (error) {
      return {
        output: this.output.join('\n'),
        error: error instanceof Error ? error.message : 'Execution error'
      };
    }
  }

  private executeLines(lines: string[], indentLevel: number = 0): void {
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        i++;
        continue;
      }

      const currentIndent = this.getIndentLevel(line);
      if (currentIndent < indentLevel) {
        break;
      }
      if (currentIndent > indentLevel) {
        i++;
        continue;
      }

      if (trimmedLine.includes('=') && !trimmedLine.includes('==') && !trimmedLine.includes('!=')) {
        this.handleAssignment(trimmedLine);
      } else if (trimmedLine.startsWith('print(')) {
        this.handlePrint(trimmedLine);
      } else if (trimmedLine.startsWith('if ')) {
        const blockEnd = this.findBlockEnd(lines, i, currentIndent);
        const condition = this.evaluateCondition(trimmedLine.replace('if ', '').replace(':', '').trim());
        if (condition) {
          const blockLines = lines.slice(i + 1, blockEnd);
          this.executeLines(blockLines, currentIndent + 1);
        }
        i = blockEnd - 1;
      } else if (trimmedLine.startsWith('while ')) {
        const blockEnd = this.findBlockEnd(lines, i, currentIndent);
        const conditionStr = trimmedLine.replace('while ', '').replace(':', '').trim();
        
        let iterations = 0;
        const maxIterations = 1000; // Prevent infinite loops
        
        while (this.evaluateCondition(conditionStr) && iterations < maxIterations) {
          const blockLines = lines.slice(i + 1, blockEnd);
          this.executeLines(blockLines, currentIndent + 1);
          iterations++;
        }
        i = blockEnd - 1;
      }
      
      i++;
    }
  }

  private getIndentLevel(line: string): number {
    let indent = 0;
    for (const char of line) {
      if (char === ' ') indent++;
      else if (char === '\t') indent += 4;
      else break;
    }
    return indent;
  }

  private findBlockEnd(lines: string[], startIndex: number, baseIndent: number): number {
    for (let i = startIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && this.getIndentLevel(lines[i]) <= baseIndent) {
        return i;
      }
    }
    return lines.length;
  }

  private handleAssignment(line: string): void {
    if (line.includes(',') && line.includes('=')) {
      // Handle tuple assignment like: a, b = b, a
      const [left, right] = line.split('=').map(s => s.trim());
      const leftVars = left.split(',').map(s => s.trim());
      const rightVars = right.split(',').map(s => s.trim());
      
      const values = rightVars.map(v => this.evaluateExpression(v));
      leftVars.forEach((varName, index) => {
        this.variables[varName] = values[index];
      });
    } else {
      const [varName, expression] = line.split('=').map(s => s.trim());
      this.variables[varName] = this.evaluateExpression(expression);
    }
  }

  private handlePrint(line: string): void {
    const match = line.match(/print\((.*)\)/);
    if (match) {
      const content = match[1].trim();
      if (content) {
        const value = this.evaluateExpression(content);
        this.output.push(String(value));
      } else {
        this.output.push('');
      }
    }
  }

  private evaluateExpression(expr: string): any {
    expr = expr.trim();
    
    // String literals
    if ((expr.startsWith("'") && expr.endsWith("'")) || 
        (expr.startsWith('"') && expr.endsWith('"'))) {
      return expr.slice(1, -1);
    }
    
    // Numbers
    if (/^-?\d+(\.\d+)?$/.test(expr)) {
      return expr.includes('.') ? parseFloat(expr) : parseInt(expr);
    }
    
    // Variables
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(expr)) {
      return this.variables[expr] ?? 0;
    }
    
    // Simple arithmetic
    if (expr.includes('+')) {
      const [left, right] = expr.split('+').map(s => this.evaluateExpression(s.trim()));
      return (typeof left === 'number' ? left : 0) + (typeof right === 'number' ? right : 0);
    }
    
    if (expr.includes('-') && !expr.startsWith('-')) {
      const [left, right] = expr.split('-').map(s => this.evaluateExpression(s.trim()));
      return (typeof left === 'number' ? left : 0) - (typeof right === 'number' ? right : 0);
    }
    
    if (expr.includes('*')) {
      const [left, right] = expr.split('*').map(s => this.evaluateExpression(s.trim()));
      return (typeof left === 'number' ? left : 0) * (typeof right === 'number' ? right : 0);
    }
    
    if (expr.includes('/')) {
      const [left, right] = expr.split('/').map(s => this.evaluateExpression(s.trim()));
      const rightVal = typeof right === 'number' ? right : 1;
      return rightVal !== 0 ? (typeof left === 'number' ? left : 0) / rightVal : 0;
    }
    
    return expr;
  }

  private evaluateCondition(condition: string): boolean {
    condition = condition.trim();
    
    if (condition.includes('>=')) {
      const [left, right] = condition.split('>=').map(s => this.evaluateExpression(s.trim()));
      return Number(left) >= Number(right);
    }
    
    if (condition.includes('<=')) {
      const [left, right] = condition.split('<=').map(s => this.evaluateExpression(s.trim()));
      return Number(left) <= Number(right);
    }
    
    if (condition.includes('>')) {
      const [left, right] = condition.split('>').map(s => this.evaluateExpression(s.trim()));
      return Number(left) > Number(right);
    }
    
    if (condition.includes('<')) {
      const [left, right] = condition.split('<').map(s => this.evaluateExpression(s.trim()));
      return Number(left) < Number(right);
    }
    
    if (condition.includes('==')) {
      const [left, right] = condition.split('==').map(s => this.evaluateExpression(s.trim()));
      return left == right;
    }
    
    if (condition.includes('!=')) {
      const [left, right] = condition.split('!=').map(s => this.evaluateExpression(s.trim()));
      return left != right;
    }
    
    // Boolean variable or expression
    const value = this.evaluateExpression(condition);
    return Boolean(value);
  }
}