"use strict";

const espree = require('espree');
var mVisitorKeys = require('espree/lib/visitor-keys');

class ECMAParser {

    static _setupVisitorKeys() {
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

    constructor() {
        this._version = this._setupECMAVersion();
        this.visitorKeys = ECMAParser._setupVisitorKeys();
    }

    setVersion(sVersion) {
        this._version = this._setupECMAVersion(sVersion);
    }

    parse(sCodeString, oOptions) {
        var ecmaVer = oOptions && oOptions.version ? this._setupECMAVersion(oOptions.version) : this._version;
        var resultAst = this._createAst(sCodeString, ecmaVer);
        return this._refactorAST(resultAst);
    }

    _createAst(sCodeString, iECMAVersion) {
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

    _setupECMAVersion(sGiven) {
        switch (sGiven) {
            case "es6":
            case "2015":
                return 6;
            case "es7":
            case "2016":
                return 7;
            case "es8":
            case "2017":
                return 8;
            case "es9":
            case "2018":
                return 9
            case "es10":
            case "2019":
                return 10
            case "":
            case undefined:
                return 5;
            default:
                return parseInt(sGiven, 10);
        }
    }

    _refactorAST(oAST, oOptions) {
        if (oOptions && oOptions.parent) {
            oAST.parent = oOptions.parent;
            oAST.path = oOptions.parent.path !== "" ? oOptions.parent.path + "." + oAST.type : oAST.type;

        } else {
            oAST.parent = undefined;
            oAST.path = oAST.type;
            oOptions = {};
        }
        oAST.name = this._createNodeName(oAST);

        var aVisitorKeys = mVisitorKeys[oAST.type];
        aVisitorKeys.forEach((sKey) => {
            if (Array.isArray(oAST[sKey])) {
                oAST[sKey] = oAST[sKey].map((oChild) => {
                    return this._refactorAST(oChild, {
                        parent: oAST
                    });
                });
            } else if (typeof oAST[sKey] === "object" && oAST[sKey] !== null) {
                oAST[sKey] = this._refactorAST(oAST[sKey], {
                    parent: oAST
                });
            }
        });
        return oAST;
    }

    _createNodeName(oAST) {
        switch (oAST.type) {
            case "AssignmentExpression":
                return this._createNodeName(oAST.left);
                //B
            case "BlockStatement":
                return oAST.parent.name;
                //C
            case "CallExpression":
                return this._createNodeName(oAST.callee);
                //E
            case "ExpressionStatement":
                var returnValue = typeof oAST.expression.value === "string" ? oAST.expression.value : this._createNodeName(oAST.expression);
                return returnValue;
                //F
            case "FunctionDeclaration":
                return oAST.id.name;
                //I
            case "Identifier":
                return oAST.name;
                //L
            case "Literal":
                return oAST.raw;
                //M
            case "MemberExpression":
                return this._memberExpressionName(oAST);
                //P
            case "Property":
                return oAST.key.name;
                //V
            case "VariableDeclaration":
                let sName = oAST.kind + " ";
                sName = sName + oAST.declarations.map((oDeclaration) => {
                    return oDeclaration.id.name;
                }).join(',');
                return sName;
            case "VariableDeclarator":
                return oAST.id.name;
            default:
                return oAST.parent ? oAST.parent.name : "root";
        }
    }

    _memberExpressionName(oAst) {
        var sName = "";
        switch (oAst.object.type) {
            case "Identifier":
                sName = oAst.object.name;
                break;
            case "MemberExpression":
                sName = this._memberExpressionName(oAst.object);
                break;
            default:
                sName = "";
        }
        sName = [sName, oAst.property.name].join('.');
        return sName;
    }
}

module.exports = new ECMAParser();