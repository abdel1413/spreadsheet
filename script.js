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
const evalFormula = (x, cells) => {};
