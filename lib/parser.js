"use strict";

const espree = require('espree');
var mVisitorKeys = require('espree/lib/visitor-keys');

function createAst(sCodeString, iECMAVersion) {
    try {
        return espree.parse(sCodeString, {
            range: false,
            loc: false,
            comment: true,
            tokens: false,
            ecmaVersion: iECMAVersion
        })
    } catch (error) {
        console.log(error);
    }
}

function setupECMAVersion(sGiven) {
    switch (sGiven) {
        case "2015":
            return 6;
        case "2016":
            return 7;
        case "2017":
            return 8;
        case "2018":
            return 9
        case "2019":
            return 10
        case "":
        case undefined:
            return 5;
        default:
            return parseInt(sGiven, 10);
    }
}

function parse(sCodeString, oOptions) {
    var ecmaVer = oOptions ? oOptions.version : "";
    var resultAst = createAst(sCodeString, setupECMAVersion(ecmaVer));
    return refactorAST(resultAst);
}

function refactorAST(oAST, oOptions) {
    if (oOptions && oOptions.parent) {
        oAST.parent = oOptions.parent;
        oAST.path = oOptions.parent.path !== "" ? oOptions.parent.path + "." + oAST.type : oAST.type;

    } else {
        oAST.parent = undefined;
        oAST.path = oAST.type;
        oOptions = {};
    }
    oAST.name = createNodeName(oAST);

    var aVisitorKeys = mVisitorKeys[oAST.type];
    aVisitorKeys.forEach((sKey) => {
        if (Array.isArray(oAST[sKey])) {
            oAST[sKey] = oAST[sKey].map((oChild) => {
                return refactorAST(oChild, {
                    parent: oAST
                });
            });
        } else if (typeof oAST[sKey] === "object" && oAST[sKey] !== null) {
            oAST[sKey] = refactorAST(oAST[sKey], {
                parent: oAST
            });
        }
    });
    return oAST;
}

function createNodeName(oAST) {
    if (typeof oAST.parent === "undefined") {
        return "root";
    } else {
        switch (oAST.type) {
            case "VariableDeclaration":
                let sName = oAST.kind + " ";
                sName = sName + oAST.declarations.map((oDeclaration) => {
                    return oDeclaration.id.name;
                }).join(',');
                return sName;
            case "VariableDeclarator":
                return oAST.id.name;
            case "Identifier":
                return oAST.name;
            case "Literal":
                return oAST.raw;
            case "FunctionDeclaration":
                return oAST.id.name;
            case "BlockStatement":
                return oAST.parent.name;
            case "MemberExpression":
                return _memberExpressionName(oAST);
            case "CallExpression":
                return createNodeName(oAST.callee);
            case "ExpressionStatement":
                return typeof oAST.expression.value === "string" ? oAST.expression.value : oAST.parent.name;
            case "Property":
                return oAST.key.name;
            default:
                return oAST.parent.name;
        }
    }
}

function _memberExpressionName(oAst) {
    var sName = "";
    switch (oAst.object.type) {
        case "Identifier":
            sName = oAst.object.name;
            break;
        case "MemberExpression":
            sName = _memberExpressionName(oAst.object);
            break;
        default:
            sName = "";
    }
    sName = sName + oAst.property.name;
    return sName;
}

function setupVisitorKeys() {
    var tempKeys = JSON.parse(JSON.stringify(mVisitorKeys));
    //remove key, because it will be used as name - indentifier
    tempKeys['Property'].splice(tempKeys['Property'].indexOf('key'), 1);
    //remove id, because it will be used as name - indentifier
    tempKeys['ClassExpression'].splice(tempKeys['ClassExpression'].indexOf('id'), 1);
    //remove callee, because it will be used as name - indentifier
    tempKeys['CallExpression'].splice(tempKeys['CallExpression'].indexOf('callee'), 1);
    //remove id, because it will be used as name - indentifier
    tempKeys['ClassDeclaration'].splice(tempKeys['ClassDeclaration'].indexOf('id'), 1);
    //remove id, because it will be used as name - indentifier
    tempKeys['FunctionExpression'].splice(tempKeys['FunctionExpression'].indexOf('id'), 1);
    //remove id, because it will be used as name - indentifier
    tempKeys['VariableDeclarator'].splice(tempKeys['VariableDeclarator'].indexOf('id'), 1);
    //remove id, because it will be used as name - indentifier
    tempKeys['FunctionDeclaration'].splice(tempKeys['FunctionDeclaration'].indexOf('id'), 1);

    return tempKeys;
}

module.exports = {
    parse: parse,
    visitorKeys: setupVisitorKeys()
}