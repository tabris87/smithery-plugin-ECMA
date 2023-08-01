import { expect } from 'chai';
import { FSTNonTerminal } from 'smithery/lib/utils';
import { ExpressionStatement } from './ExpressionStatement.strategy';

module.export = function () {
    describe('Check the conversion strategy for ExpressionStatement', () => {
        describe('Test the AST to FST conversion', () => {
            let rootAST;
            let tempResultFST;
            const expStrategy = new ExpressionStatement();

            beforeEach('Setup AST', () => {
                //setup the AST structure
                rootAST = {
                    type: "ExpressionStatement",
                    expression: {}
                };

                //setup the base FST structure
                tempResultFST = new FSTNonTerminal("ExpressionStatement", "root");
                tempResultFST.setParent();
            });

            it(`Successfull FST transformation for an emtpy Expression`, () => {
                const transformedFST = expStrategy.toFST(rootAST);
                expect(transformedFST).to.be.eql(tempResultFST);
            });

            it(`Successfull FST transformation for an 'use strict;' Expression`, () => {
                rootAST.expression = {
                    type: "Literal",
                    value: "use strict",
                    raw: "\"use strict\""
                };
                rootAST.directive = "use strict";
            });
        });
    });
}