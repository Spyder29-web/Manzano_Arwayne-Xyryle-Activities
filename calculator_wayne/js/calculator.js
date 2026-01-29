const numBox = document.getElementById("numBox");
const opBox = document.getElementById("opBox");

const nums = document.querySelectorAll(".num");
const ops = document.querySelectorAll(".op");

const equals = document.getElementById("equals");
const ac = document.getElementById("ac");
const c = document.getElementById("c");

let firstNum = null;
let secondNum = null;
let operator = "";
let isSecond = false;
let afterEquals = false;

// show number
function updateDisplay(value) {
  numBox.textContent = value;
}

// add number input
function appendNumber(n) {
  if (afterEquals) {
    updateDisplay(n === "." ? "0." : n);
    afterEquals = false;
    return;
  }

  let current = numBox.textContent;

  // kapag 0 tapos number ang pinindot
  if (current === "0" && n !== ".") {
    current = n;
  } else {
    // bawal dalawang dot
    if (n === "." && current.includes(".")) return;
    current += n;
  }

  updateDisplay(current);
}

// compute
function calculate(a, b, op) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "×") return a * b;
  if (op === "÷") return b === 0 ? "Error" : a / b;
  return b;
}

// number click
nums.forEach(btn => {
  btn.addEventListener("click", () => {
    appendNumber(btn.dataset.num);
  });
});

// operator click (automatic zero sa numBox)
ops.forEach(btn => {
  btn.addEventListener("click", () => {
    if (afterEquals) {
      firstNum = parseFloat(numBox.textContent);
      afterEquals = false;
    } else if (isSecond) {
      // perform calculation for chaining
      secondNum = parseFloat(numBox.textContent);
      let result = calculate(firstNum, secondNum, operator);
      updateDisplay(result);
      firstNum = parseFloat(result);
    } else {
      // save first number
      firstNum = parseFloat(numBox.textContent);
    }

    operator = btn.dataset.op;

    // show operator in separate box
    opBox.textContent = operator;

    // automatic reset to 0 para sa 2nd number
    updateDisplay("0");
    isSecond = true;
  });
});

// equals click
equals.addEventListener("click", () => {
  if (firstNum === null || operator === "") return;

  secondNum = parseFloat(numBox.textContent);

  let result = calculate(firstNum, secondNum, operator);

  updateDisplay(result);

  // reset operator box
  opBox.textContent = "";

  // allow continue calculation
  firstNum = (result === "Error") ? null : parseFloat(result);
  operator = "";
  secondNum = null;
  isSecond = false;
  afterEquals = true;
});

// AC (reset all)
ac.addEventListener("click", () => {
  updateDisplay("0");
  opBox.textContent = "";
  firstNum = null;
  secondNum = null;
  operator = "";
  isSecond = false;
});

// C (delete last)
c.addEventListener("click", () => {
  let current = numBox.textContent;

  if (current.length <= 1 || current === "Error") {
    updateDisplay("0");
  } else {
    updateDisplay(current.slice(0, -1));
  }
});