const generator = require('../lib/generator');
const parser = require('../lib/parser');
const sorter = require('../lib/sorter');
const aRules = require('../lib/rules');
//setup the heavy dependency chain
const ImposerCL = require('smithery/lib/Imposer');
const ParserCL = require('smithery/lib/Parser');
const GeneratorCL = require('smithery/lib/Generator');
const RuleSetCL = require('smithery/lib/RuleSet');

const oImposer = new ImposerCL({
  parser: new ParserCL(),
  generator: new GeneratorCL(),
  rules: new RuleSetCL()
})

oImposer.getParser().addParser(parser, 'ECMA');
oImposer.getGenerator().addGenerator(generator, 'ECMA');
oImposer.getRuleSet().addMultipleRules(aRules);

function imposing(sBaseECMA, sFeatureECMA) {
  const oASTBase = parser.parse(sBaseECMA);
  const oASTFeature = parser.parse(sFeatureECMA);
  const resultAST = oImposer.impose(oASTBase, oASTFeature, oImposer.getParser().getVisitorKeys('xml'));
  return oImposer.getGenerator().generate(resultAST, 'ECMA');
}

function formatResult(sResultString) {
  return generator.generate(parser.parse(sResultString));
}

function sorting(sInputString) {
  let oAST = parser.parse(sInputString);
  oAST = sorter.sort(oAST);
  return generator.generate(oAST);
}

module.exports = {
  imposing,
  formatResult,
  sorting
}