const { add, multiply } = require("../src/math");

test("adds two numbers", () => {
  expect(add(2, 3)).toBe(5);
});

test("multiplies two numbers", () => {
  expect(multiply(4, 5)).toBe(20);
});

// Flaky test: passes only about half of the time
test("random flaky test", () => {
  expect(Math.random()).toBeGreaterThan(0.5);
});
