const sorter = require('./lib/sorter');
const parser = require('./lib/parser');
const generator = require('./lib/generator');

const sInput = 'var a = "Hello World";\nvar wat = require("Whyever");';
const sOutput = 'var wat = require("Whyever");\nvar a = "Hello World";';

const oAst = parser.parse(sInput);
const sResult = generator.generate(sorter.sort(oAst));

console.log(sResult);
console.log();
console.log('Expected result:');
console.log(sOutput);


