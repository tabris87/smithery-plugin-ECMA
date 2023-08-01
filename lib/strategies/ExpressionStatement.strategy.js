const RootStrategy = require('./RootStrategy.strategy');
const { FSTNonTerminal } = require('smithery/lib/utils/index.js');


class ExpressionStatementStrategy extends RootStrategy {
    static childKeys = ["expression"];
    static nodeType = "ExpressionStatement";

    constructor(mOptions) {
        super(mOptions);
    }

    toFST(oAST, parent) {
        this._ast = oAST;
        this.removeDefaults(this._ast);

        const nO = new FSTNonTerminal(this._ast.type, this._determineName(this._ast, parent));
        nO.setParent(parent);

        if (this._ast.expression && typeof this._ast.expression !== null) {
            const oStrategy = TransformerFactory.getStrategy(oC, this.getStrategyOptions());
            nO.addChild(oStrategy.toFST(oC, nO));
        }

        if (this.getStrategyOptions()['featureName']) {
            nO.setFeatureName(this.getStrategyOptions()['featureName']);
        }

        return nO;
    }

    toAST(oFST, parent) {
        this._fst = oFST;
        const node = {};
        node.type = this._fst.getType();
        //we assume that there are only one child within the expression.
        const childNode = this._fst.getChildAt(0);
        const oStrategy = TransformerFactory.getStrategy(oC);
        node.expression = oStrategy.toAST(oC, childNode);

        return node;
    }

    _determineName(oAST, parent) {
        if (!parent) {
            return 'root';
        } else {
            return oAST.type + '_' + parent.getName();
        }
    }
}

module.exports = ExpressionStatementStrategy;