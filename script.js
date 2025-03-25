const { CommandSucceededEvent } = require("mongodb");

window.onload = () => {
  const container = document.getElementById("container");

  const createLabel = (name) => {
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = name;
    container.appendChild(label);
  };
  // call the charRange mthod and pass A and J
  //loop thru letters array and pass createLabel
  // reference as call back
  const letters = charRange("A", "J");
  letters.forEach(createLabel);
  console.log(letters);
  // generate numbers by calling range() and pass
  // 1 and 99 as param
  // inside the forEach(), make two function calls:
  //a)  call createLabel function
  //and pass each num to it as param
  // b) loop thru letters array to generate inputs
  // add those inputs to container
  range(1, 99).forEach((number) => {
    createLabel(number);
    letters.forEach((letter) => {
      const input = document.createElement("input");
      input.type = "text";
      input.id = letter + number;
      input.ariaLabel = letter + number;
      //call update when the value changes using onchange()
      input.onchange = update;
      container.appendChild(input);
    });
  });
};

//an infix is an operator that appears btw two opperands
const infixToFunction = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y,
};
//access infixTofunction property and call
// the associated function to evaluate the calculation
//infixToFunction['+']("1", "2")
const infixEval = (str, regex) =>
  str.replace(regex, (_match, arg2, operator, arg2) =>
    infixToFunction[operator](parseFloat(arg1), parseFloat(arg2))
  );

//highPrecedence is a func to evaluate an operation
//in string following the high precedenc rule
//1 : funct with str as param
// 2: inside the funct, create a regex matching digid
// operator (* or /) followed by another digit
// 3 :  call infixEval (str, and regex) and save it in var
//4:  if regex matches the str return str ortherwise
// recursively call the function and var you saved

// NOTE WE USE RECURSIVE CALL AS THE TEXT JUST
//RETURN THE FIRST MATCH SO WE NEED TO CALL FUNCTION
//AGAIN TO CHECK FOR POSSIBEL OPERATORS
const highPrecedence = (str) => {
  const regex = /([\d.])+([*\/])([\d.])+/;
  const str2 = infixEval(str, regex);
  return str2 === str ? str : highPrecedence(str2);
};

const applyFunction = (str) => {
  const noHigh = highPrecedence(str);
  const infix = /([\d.]+)([+-])([\d.]+)/;
  const str2 = infixEval(noHigh, infix);

  const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i;
  //this  call a function like sum(1,4)

  // funct to split the arg based on , and call map() with
  //parseFloat as argument
  const toNumberList = (args) => args.split(",").map(parseFloat);

  //funct with twa orgs (fn , args) that access
  // the value (function) of spreadsheetFunction obj
  //then call the function toNumbeList and pass
  // args to split it
  const apply = (fn, args) =>
    spreasheetFunctions[fn.toLowerCase()](toNumberList(args));

  return str2.replace(functionCall, (match, fn, args) =>
    spreasheetFunctions.hasOwnProperty(fn) ? apply(fn, args) : match
  );
};

const isEven = (num) => num % 2 === 0;

const sum = (nums) => nums.reduce((acc, el) => acc + el, 0);

const average = (nums) => sum(nums) / nums.length;

//find the median of the array
//1) make a shallow copy of the original array
// 2) sort it
// 3) find the length;
//4) find the middle
// 5) check if it is length is even
// a)return average of first middle index (length /2)
//and 2nd middle index (lenghth/2)-1
// b) otherwise return the middle
const median = (nums) => {
  const sorted = nums.slice().sort((a, b) => a - b);
  const length = sorted.length;
  const middle = length / 2 - 1;
  return isEven(length)
    ? average([sorted[middle], sorted[middle + 1]])
    : sorted[Math.ceil(middle)];
};

//create an object to keep track of all the the functions
const spreasheetFunctions = {
  sum,
  average,
  median,
  even: (nums) => nums.filter(isEven),
  someeven: (nums) => nums.some(isEven),
  everyeven: (nums) => nums.every(isEven),
  firsttwo: (nums) => nums.slice(0, 2),
  lasttwo: (nums) => nums.slice(-2),
  has2: (nums) => nums.includes(2),
  increment: (nums) => nums.map((num) => num + 1),
  random: ([x, y]) => Math.floor(Math.random() * y + x),
  range: (nums) => range(...nums),
  nodupes: (nums) => [...new Set(nums).values()],
  "": (n) => n,
};

// need tell the window.onload function
// to update elt if there is any
// event is a change event
const update = (event) => {
  const element = event.target();
  const value = element.value.replace(/\s/g, "");
  //if the first char of cell is '=' ie calculation
  //should be used and spreadsheet function
  //should eveluated
  if (!value.includes(element.id) && value[0] === "=") {
    //as value start with = that triggers the function
    //we need to get the value starting from second to the end
    //access the container children and pass them as 2nd param
    //using Array.from() to convert container children (array-like)
    // to proper array.
    element.value = evalFormula(
      value.slice(1),
      document.getElementById("container").children
    );
  }
};

//1 use Array constructor to calculate the size
//2 use .fill() to fill an array with values
//(here i use only the value of start)
//3) call map()on .fill()method and pass 2params
//then return the sum of both params

const range = (start, end) =>
  Array(end - start + 1)
    .fill(start)
    .map((el, indx) => el + indx);

//1) create a char range function that
//range function to generate character range
//so it can also use letters;
// 2) as range() expects number, we need to convert
// the args of charRange to their associated code
//using .charCodeAt(0)
//3) the returning value of range would be numbers
//so we need to convert those numbers back to string char
//using map()

const charRange = (start, end) =>
  range(start.charCodeAt(0), end.charCodeAt(0)).map((code) =>
    String.fromCharCode(code)
  );

// to run spreadsheet functions, we need to
//parse and evaluate the input string
const evalFormula = (x, cells) => {
  //find  value of the cell  whose id = id passed as param
  const idToText = (id) => cells.find((cell) => cell.id === id).value;

  //match cell ranges in a formula.
  //Cell ranges look like A1: B12 or A3: A25
  //match cell chars then match number
  //[1 - 9] and optional [0-9]
  // then :
  // then the same patterns as the first part of colunm
  const rangeRegex = /([A-J])([1-9][-0-9]?):([A-J])([1-9][0-9]?)/gi;

  const rangeFromString = (num1, num2) => range(parseInt(num1), parseInt(num2));

  //Use carrying (return fnc within fnc)
  // process allows to create a variable
  //that holdsa funct to be called later
  //const innerOne = elemValue(1)
  // const finalCall = innerOne("B")
  const elemValue = (num) => {
    const inner = (character) => {
      return idToText(character + num);
    };

    return inner;
  };
  //funct reference is name of function
  // passed as callback without ()
  //so here we pass elemValue as callbak in map()
  const addCharacters = (character1) => (character2) => (num) =>
    charRange(character1, character2).map(elemValue(num));

  //create function that replace regeEx with function
  //as  rangeExt has 4capture groups, let callback
  //should have param for each capture grp

  // addCharacters return function that will be called later
  //so we can chain two func calls immediately
  const rangeExpanded = x.replace(
    rangeRegex,
    (_match, char1, num1, char2, num2) =>
      rangeFromString(num1, nun2).map(addCharacters(char1)(char2))
  );
  const cellRegex = /[A-J][1-9][0-9]?/gi;
  const cellExpanded = rangeExpanded.replace(cellRegex, (match) =>
    idToText(match.toUpperCase())
  );

  // if functionExpanded matches x return it otherwise
  // call recursively the function and pass functionexpanded
  // and cells for next evaluation
  const functionExpanded = applyFunction(cellExpanded);
  return functionExpanded === x
    ? functionExpanded
    : evalFormula(functionExpanded, cells);
};
