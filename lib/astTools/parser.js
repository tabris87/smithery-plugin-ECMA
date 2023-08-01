"use strict";
const espree = require('espree');

debugger; 
function createAst(sCodeString, iECMAVersion) {
    try {
        return espree.parse(sCodeString, {
            range: false,
            loc: false,
            comment: true,
            tokens: true,
            ecmaVersion: iECMAVersion ? iECMAVersion : 6
        })
    } catch (error) {
        console.log(error);
    }
}

function prepareAst(oAST) {
    delete oAST.end;
    delete oAST.start;

    espree.VisitorKeys[oAST.type].forEach((sChildKey) => {
        var childs = oAST[sChildKey];
        if (Array.isArray(childs)) {
            childs.forEach(c => {
                prepareAst(c);
            })
        } else {
            prepareAst(childs);
        }
    });
    return oAST;
}

function parse(sCodeString, oOptions) {
    try {
        let oAst = createAst(sCodeString, oOptions.ecmaVersion);
        oAst = prepareAST(oAst);
        return oAst
    } catch (oError) {
        throw new Error('Invalid ECMA-Script input!');
    }
}

module.export = {
    parse
}