const strats = require('./strategies/index.js');

export class TransformerFactory {

    static getStrategy(oNode, mOptions) {
        if (oNode.getType) {
            for (let key of Object.keys(strats)) {
                if (strats[key].nodeType === oNode.getType()) {
                    return new strats[key](mOptions);
                }
            }
        } else {
            for (let key of Object.keys(strats)) {
                if (strats[key].nodeType === oNode.type) {
                    return new strats[key](mOptions);
                }
            }
        }
        return undefined;
    }
}