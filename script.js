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
      container.appendChild(input);
    });
  });
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
console.log(range(1, 9));
console.log(charRange("A", "J"));
