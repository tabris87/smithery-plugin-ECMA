const fs = require('fs');
const espree = require('espree');
const mVisitorKeys = require('eslint-visitor-keys');

function removePosition(oAst) {
    delete oAst.start;
    delete oAst.end;
    mVisitorKeys.KEYS[oAst.type].forEach(key => {
        const content = oAst[key];
        if (Array.isArray(content)) {
            content.forEach(c => {
                if (c) {
                    removePosition(c);
                }
            })
        } else {
            if (content) {
                removePosition(content);
            }
        }
    })
}


const sContent = fs.readFileSync('./test.js', 'utf-8');
const oAST = espree.parse(sContent, { ecmaVersion: 6 });
removePosition(oAST);
debugger;
