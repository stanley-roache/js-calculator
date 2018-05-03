var stack = [],
    currentTotal = 0,
    temp = '',
    operators = {
      '^': (a,b) => Math.pow(a,b),
      'holder': (a,b) => null,
      'x': (a,b) => a*b,
      '/': (a,b) => a/b,
      '+': (a,b) => a+b,
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
      // display the number so far
      $("#display").html(stack.join('') + temp);
      
    // Clear all calculator contents
    } else if (val === 'AC') {
      stack = [];
      temp = '';
      currentTotal = 0;
      $("#display").html(currentTotal);

    // Clear last entry
    } else if (val === 'CE') {
      temp = '';
      $("#display").html(stack.join('') || 0);
      
    // add operator
    } else if (operators.hasOwnProperty(val)) {
      stack.push(temp);
      stack.push(val);
      temp = '';
      $("#display").html(stack.join(''));

    // evaluate calculation
    } else if (val === '=') {
      stack.push(temp);

      currentTotal = evaluate(stack);

      $("#display").html(currentTotal);
      stack = [];
      temp = '' + currentTotal;
    }
  });
});

// takes array of entries and evaluates
function evaluate(stack) {
  let alterStack = [];
  // iterate over and perform all ^ operations
  for (let i = 0; i < stack.length; i++) {
    if (stack[i] == '^') {
      alterStack.push(operators[stack[i]](alterStack.pop(),stack[i+1]));
      i++;
    } else alterStack.push(stack[i]);
  }
  stack = [];
  // go over the remainder performing all multiplication and division
  for (let i = 0; i < alterStack.length; i++) {
    if (alterStack[i] == 'x' || alterStack[i] == '/') {
      stack.push(operators[alterStack[i]](stack.pop(),alterStack[i+1]));
      i++;
    } else stack.push(alterStack[i]);
  }
  // finally perform all addition and subtraction
  var result = Number(stack[0]);
  for (let i = 1; i < stack.length; i+=2) {
    if (stack[i] == '+') result += Number(stack[i+1]);
    else result -= stack[i+1];
  }
  // clear stack
  stack = [];
  return result || "something's wrong";
}