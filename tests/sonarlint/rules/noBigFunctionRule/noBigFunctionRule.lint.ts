export function toCreateModule() {}

function foo() {
  //^^^^^^^^ {{This function has 202 lines, which is greater than the 200 lines authorized. Split it into smaller functions.}}

  function bar() {}
}
