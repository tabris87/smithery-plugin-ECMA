class RootStrategy {
    constructor(mOptions) {
        this._strategyOptions = {};
        if (mOptions && mOptions.featureName) {
            this._strategyOptions.featureName = mOptions.featureName;
        }
    }

    getStrategyOptions() {
        return this._strategyOptions;
    }

    removeDefaults(oAST) {
        delete oAST.start;
        delete oAST.end;
    }
}

module.exports = RootStrategy;