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
      stack.push(temp || currentTotal);
      stack.push(val);
      temp = '';

    // evaluate calculation
    } else if (val === '=') {
      stack.push(temp);
      currentTotal = evaluate();
      stack = [];
      temp = '';
    }
    // display calculation string so far
    $("#display").html((stack.join('') + temp) || currentTotal);
  });
});

// takes array of entries and evaluates
function evaluate() {
  performType(['^']);
  performType(['x', '/']);
  performType(['+','-']);
  return ('' + stack.pop()) || "something's wrong";
}

// this loops over the stack and performs the specified operations
function performType(types) {
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
  stack = newStack.slice();
}