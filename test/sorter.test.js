const {
  sorting
} = require('./testUtils');

test('Simple sorting', () => {
  const sInput = 'var a = "Hello World"; var wat = require("Whyever");';
  const sOutput = 'var wat = require("Whyever");\nvar a = "Hello World";';

  expect(sorting(sInput)).toEqual(sOutput);
});
