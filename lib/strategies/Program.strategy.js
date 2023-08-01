const RootStrategy = require('./RootStrategy.strategy');
const { FSTNonTerminal } = require('smithery/lib/utils/index.js');
const { TransformerFactory } = require('../../../smithery-plugin-json/lib/astTools/TransformerFactory');

class ProgramStrategy extends RootStrategy {
    static childKeys = ["body"];
    static nodeType = 'Program';

    constructor(mOptions) {
        super(mOptions);
    }

    toFST(oAST, parent) {
        this._ast = oAST;
        this.removeDefaults(this._ast);

        const nO = new FSTNonTerminal(this._ast.type, this._determineName(this._ast, parent));
        nO.setParent(parent);

        if (this._ast.body.length > 0) {
            nO.addChildren(this._ast.body.map(oC => {
                const oStrategy = TransformerFactory.getStrategy(oC, this.getStrategyOptions());
                return oStrategy.toFST(oC, nO);
            }));
        }

        if (this.getStrategyOptions()['featureName']) {
            nO.setFeatureName(this.getStrategyOptions()['featureName']);
        }

        let tempBody = this._ast.body;
        delete this._ast.body;
        nO.originNode = JSON.stringify(this._ast);
        this._ast.body = tempBody;
        return nO;
    }

    toAST(oFST, parent) {
        this._fst = oFST;
        const node = {}
        node.type = this._fst.getType();
        node.body = this._fst.getChildren().map(oC => {
            const oStrategy = TransformerFactory.getStrategy(oC);
            return oStrategy.toAST(oC, node);
        });
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

module.exports = ProgramStrategy;