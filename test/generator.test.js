const generator = require('../lib/generator');
const Node = require('featurecli-commons').types.Node;

const aTests = [{
    title: 'Empty JavaScript',
    js: '',
    ast: function () {
        let node = new Node();
        node.type = "Program";
        node.start = 0;
        node.end = 0;
        node.sourceType = "script";
        node.comments = [];
        node.body = [];
        node.path = "Program";
        node.name = "root";
        node.parent = undefined;
        return node;
    }
}, {
    title: 'Single variable declaration, without definition',
    js: 'var a;',
    ast: function () {
        let node = new Node();
        node.type = "Program";
        node.start = 0;
        node.end = 6;
        node.sourceType = "script";
        node.comments = [];
        node.body = [
            (function () {
                let subNode = new Node();
                subNode.type = "VariableDeclaration";
                subNode.start = 0;
                subNode.end = 6;
                subNode.declarations = [
                    (function () {
                        let subSubNode = new Node();
                        subSubNode.type = "VariableDeclarator";
                        subSubNode.start = 4;
                        subSubNode.end = 5;
                        subSubNode.id = (function () {
                            let subSubSubNode = new Node();
                            subSubSubNode.type = "Identifier";
                            subSubSubNode.start = 4;
                            subSubSubNode.end = 5;
                            subSubSubNode.name = "a";
                            //added properties
                            subSubSubNode.path = "Program.VariableDeclaration.VariableDeclarator.Identifier";
                            subSubSubNode.parent = subSubNode;
                            return subSubSubNode;
                        })();
                        subSubNode.init = null;
                        //added properties
                        subSubNode.path = "Program.VariableDeclaration.VariableDeclarator";
                        subSubNode.parent = subNode;
                        subSubNode.name = "a";
                        return subSubNode;
                    })()
                ];
                subNode.kind = "var";
                //added properties
                subNode.path = "Program.VariableDeclaration";
                subNode.parent = node;
                subNode.name = "var a";
                return subNode;
            })()
        ];
        //added properties
        node.path = "Program";
        node.parent = undefined;
        node.name = "root";
        return node;
    }
}, {
    title: 'Single variable declaration, with definition',
    js: 'var a = 1;',
    ast: function () {
        let node = new Node();
        node.type = "Program";
        node.start = 0;
        node.end = 10;
        node.sourceType = "script";
        node.comments = [];
        node.body = [
            (function () {
                let subNode = new Node();
                subNode.type = "VariableDeclaration";
                subNode.start = 0;
                subNode.end = 10;
                subNode.declarations = [
                    (function () {
                        let subSubNode = new Node();
                        subSubNode.type = "VariableDeclarator";
                        subSubNode.start = 4;
                        subSubNode.end = 9;
                        subSubNode.id = (function () {
                            let subSubSubNode = new Node();
                            subSubSubNode.type = "Identifier";
                            subSubSubNode.start = 4;
                            subSubSubNode.end = 5;
                            subSubSubNode.name = "a";
                            //added properties
                            subSubSubNode.path = "Program.VariableDeclaration.VariableDeclarator.Identifier";
                            subSubSubNode.parent = subSubNode;
                            return subSubSubNode;
                        })();
                        subSubNode.init = (function () {
                            let subSubSubNode = new Node();
                            subSubSubNode.type = "Literal";
                            subSubSubNode.start = 8;
                            subSubSubNode.end = 9;
                            subSubSubNode.value = 1;
                            subSubSubNode.raw = "1";
                            //added properties
                            subSubSubNode.path = "Program.VariableDeclaration.VariableDeclarator.Literal";
                            subSubSubNode.parent = subSubNode;
                            subSubSubNode.name = "1";
                            return subSubSubNode;
                        })();
                        //added properties
                        subSubNode.path = "Program.VariableDeclaration.VariableDeclarator";
                        subSubNode.parent = subNode;
                        subSubNode.name = "a";
                        return subSubNode;
                    })()
                ];
                subNode.kind = "var";
                //added properties
                subNode.path = "Program.VariableDeclaration";
                subNode.parent = node;
                subNode.name = "var a";
                return subNode;
            })()
        ];
        //added properties
        node.path = "Program";
        node.parent = undefined;
        node.name = "root";
        return node;
    }
}, {
    title: 'Single function declaration, without function code',
    js: 'function a() {\n}',
    ast: function () {
        let node = new Node();
        node.type = "Program";
        node.start = 0;
        node.end = 14;
        node.sourceType = "script";
        node.comments = [];
        node.body = [
            (function () {
                let subNode = new Node();
                subNode.type = "FunctionDeclaration";
                subNode.start = 0;
                subNode.end = 14;
                subNode.id = (function () {
                    let subSubNode = new Node();
                    subSubNode.type = "Identifier";
                    subSubNode.start = 9;
                    subSubNode.end = 10;
                    subSubNode.name = "a";
                    //added properties
                    subSubNode.path = "Program.FunctionDeclaration.Identifier";
                    subSubNode.parent = subNode;
                    return subSubNode;
                })();
                subNode.params = [];
                subNode.body = (function () {
                    let subSubNode = new Node();
                    subSubNode.type = "BlockStatement";
                    subSubNode.start = 12;
                    subSubNode.end = 14;
                    subSubNode.body = [];
                    //added properties
                    subSubNode.path = "Program.FunctionDeclaration.BlockStatement";
                    subSubNode.parent = subNode;
                    subSubNode.name = "a";
                    return subSubNode;
                })();
                subNode.expression = false;
                subNode.generator = false;
                //added properties
                subNode.path = "Program.FunctionDeclaration";
                subNode.parent = node;
                subNode.name = "a";
                return subNode;
            })()
        ];
        //added properties
        node.path = "Program";
        node.parent = undefined;
        node.name = "root";
        return node;
    }
}]

aTests.forEach(function (oTest) {
    test(oTest.title, () => {
        expect(generator.generate(oTest.ast())).toEqual(oTest.js);
    });
})