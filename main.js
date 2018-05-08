var stack = [],
    currentTotal = 0,
    temp = '',
    operators = {
      '^': (a,b) => Math.pow(a,b),
      'x': (a,b) => a*b,
      '/': (a,b) => a/b,
      '+': (a,b) => Number(a)+Number(b),
      '-': (a,b) => a-b,
    }

// When the DOM is loaded
$('document').ready(function() {
  // add as listener to all buttons
  $("button").click(function() {
    // store button value
    var val = $(this).text();
    // Stack the number into temp
    if (/[0-9.]/.test(val)) {
      if (currentTotal) {
        currentTotal = 0;
        temp = '';
      }
      temp += val;
      
    // Clear all calculator contents
    } else if (val === 'AC') {
      stack = [];
      temp = '';
      currentTotal = 0;

    // Clear last entry
    } else if (val === 'CE') {
      temp = '';
      
    // add operator
    } else if (operators.hasOwnProperty(val)) {
      if (temp) stack.push(temp);
      else if (stack.length == 0) stack.push(currentTotal);
      stack.push(val);
      temp = '';

    // evaluate calculation
    } else if (val === '=') {
      if (temp) stack.push(temp);
      currentTotal = evaluate(stack);
      stack = [];
      temp = '';
    // it's a bracket
    } else {
      if (temp) stack.push(temp);
      stack.push(val);
      temp = '';
    }
    // display calculation string so far
    $("#display").html((stack.join('') + temp) || currentTotal);
  });
});

// takes array of entries and evaluates
function evaluate(stack) {
  // deal with brackets through nested 'evaluate' calls
  let outerExpression = [],
      innerExpression = [];
  while (stack.length > 0) {
    if (stack[0] == '(') {
      // get rid of bracket
      stack.shift();
      // iniate variable to track nested brackets if any
      let counter = 1;
      // push everything inside bracket pair to inner expression
      while (counter) {
        // get next entry
        let current = stack.shift();
        if (current == '(') counter++;
        else if (current == ')') counter--;
        if (counter) innerExpression.push(current);
      }
      // evaluate inner expression and push result to outer expression as single entry
      outerExpression.push(evaluate(innerExpression));
    } else {
      // send the element to the outer expression
      outerExpression.push(stack.shift()); 
    }
  }
  stack = performType(outerExpression, ['^']);
  stack = performType(stack, ['x', '/']);
  stack = performType(stack, ['+','-']);
  return ('' + stack.pop()) || "something's wrong";
}

// this loops over the stack and performs the specified operations
function performType(stack, types) {
  let newStack = [];
  for (let i = 0; i < stack.length; i++) {
    // check if the next entry matches up with one of the specified operators
    if (types.indexOf(stack[i]) != -1) {
      // pop the last operand off the new stack and do the operation by looking it up in the operators object
      newStack.push(operators[stack[i]](newStack.pop(),stack[i+1]));
      // skip forward once to account for the second operand
      i++;
    // otherwise push the next operand onto the new stack
    } else newStack.push(stack[i]);
  }
  return newStack.slice();
}