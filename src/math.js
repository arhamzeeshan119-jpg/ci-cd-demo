function add(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { add, multiply };
  test("random flaky test", () => { expect(Math.random()).toBeGreaterThan(0.5); });
