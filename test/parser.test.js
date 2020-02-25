const parser = require('../lib/parser');
const Node = require('featurecli-commons').types.Node;

const aTests = [{
    title: 'Empty JavaScript',
    js: '',
    result: function () {
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
    result: function () {
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
}]

aTests.forEach(function (oTest) {
    test(oTest.title, () => {
        expect(parser.parse(oTest.js)).toEqual(oTest.result());
    });
})