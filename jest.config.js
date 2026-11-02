// Only run the real tests. The "errors" folder holds ready-made broken
// files for practice and must never run as part of the normal test suite.
module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/errors/"],
  modulePathIgnorePatterns: ["<rootDir>/errors/"],
};
