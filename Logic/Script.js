const display = document.getElementById('displayBody');
let expression = '';

function updateDisplay() {
  display.textContent = expression === '' ? '0' : expression;
}

const operators = ['+', '-', 'x', '/'];

document.querySelectorAll('button[data-value]').forEach((button) => {
//   const value = button.getAttribute('data-value');
  const value = button.dataset.value;

  button.addEventListener('click', () => {
    if (!isNaN(value)) {
      // Number button
      expression += value;
    } else if (operators.includes(value)) {
      // Operator button
      if (expression === '') {
        if (value === '-'){
            expression += value;
        }
      }
      const lastChar = expression[expression.length - 1];
      if (operators.includes(lastChar)) {
        expression = expression.slice(0, -1) + value;
      } else {
        expression += value;
      }
    } else if (value === '%') {
      expression = applyPercentage(expression);
    }
    updateDisplay();
  });
});

document.getElementById('equals').addEventListener('click', () => {
  if (expression === '') return;
  const result = evaluateExpression(expression);
  expression = result.toString();
  updateDisplay();
});

document.getElementById('allClear').addEventListener('click', () => {
  expression = '';
  updateDisplay();
});

document.getElementById('clear').addEventListener('click', () => {
  expression = expression.slice(0, -1);
  updateDisplay();
});

// --- Percentage handler ---
function applyPercentage(expr) {
  // Match the last number in the expression (the one currently being typed)
  const match = expr.match(/(\d+\.?\d*)$/);
  if (!match) return expr;

  const lastNumber = match[0];
  const percentValue = (parseFloat(lastNumber) / 100).toString();

  // Replace just that trailing number with its percentage value
  return expr.slice(0, -1) + percentValue;
//   return expr.slice(0, expr.length - lastNumber.length) + percentValue;
}
 
// --- BODMAS evaluator ---
function evaluateExpression(expr) {
  const tokens = expr.match(/(\d+\.?\d*)|[+\-x/]/g);
  if (!tokens) return 0;

  let pass1 = [tokens[0]];
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const nextNum = tokens[i + 1];
    if (op === 'x' || op === '/') {
      const prevNum = parseFloat(pass1.pop());
      const curr = parseFloat(nextNum);
      const result = op === 'x' ? prevNum * curr : prevNum / curr;
      pass1.push(result.toString());
    } else {
      pass1.push(op, nextNum);
    }
  }

  let result = parseFloat(pass1[0]);
  for (let i = 1; i < pass1.length; i += 2) {
    const op = pass1[i];
    const num = parseFloat(pass1[i + 1]);
    if (op === '+') result += num;
    else if (op === '-') result -= num;
  }

  return result;
}