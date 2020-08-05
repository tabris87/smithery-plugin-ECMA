"use strict";

const mVisitorKeys = require('espree/lib/visitor-keys');
const indexMap = {
  'VariableDeclaration': {
    value: 0,
    nestedCheck: 'declarations'
  },
  'VariableDeclarator': {
    value: 1,
    nestedCheck: 'init'
  },
  'Literal': {
    value: 2
  },
  'CallExpression': {
    value: 3,
    nestedCheck: 'name',
    conditional: (sValue) => { return sValue === 'require' ? -1 : 3 }
  }
};


class ECMASorter {
  constructor() {
    this.jumpList = [
      'VariableDeclarator'
    ]

    this.visitors = mVisitorKeys;
    this.visitors["VariableDeclarator"] = this.visitors["VariableDeclarator"].filter((i) => i !== 'id');
  }

  sort(oAST) {
    oAST[mVisitorKeys[oAST.type]].sort((a, b) => this._compare(a, b));
    return oAST;
  }

  _compare(a, b) {
    const value = this._compareValue(a) - this._compareValue(b);
    console.log(`Type a: ${a.type}\nType b: ${b.type}\nCompare-Value: ${value}\n`);
    if (value === 0) {
      if (a.type === b.type && this.jumpList.find(el => el === a.type)) {
        return this._compare(a[this.visitors[a.type]], b[this.visitors[b.type]]);
      }
      if (Array.isArray(a[this.visitors[a.type]]) && Array.isArray(b[this.visitors[b.type]])) {
        this.sort(a);
        this.sort(b);
        const lengthA = a[this.visitors[a.type]].length;
        const lengthB = b[this.visitors[b.type]].length;
        let index = 0;
        const maxIndex = lengthA > lengthB ? lengthB : lengthA;
        const overlflowReturn = lengthA - lengthB;
        let compareValue = 0;
        while (compareValue === 0 && maxIndex > index) {
          compareValue = this._compare(a[this.visitors[a.type]][index], b[this.visitors[b.type]][index]);
          index++;
        }
        return compareValue === 0 ? overlflowReturn : compareValue;
      } else if (Array.isArray(a[this.visitors[a.type]]) && !Array.isArray(b[this.visitors[b.type]])) {
        this.sort(a);
        const firstCompare = this._compare(a[0], b);
        return firstCompare !== 0 ? firstCompare : 1;
      } else if (!Array.isArray(a[this.visitors[a.type]]) && Array.isArray(b[this.visitors[b.type]])) {
        const firstCompare = this._compare(a, b[0]);
        return firstCompare !== 0 ? firstCompare : -1;
      } else {
        return this._compare(a[this.visitors[a.type]], b[this.visitors[b.type]]);
      }
    } else {
      return value;
    }
  }

  _compareValue(oNode) {
    let val = indexMap[oNode.type];
    if (val && val.nestedCheck) {
      if (typeof oNode[val.nestedCheck] === 'object') {
        if (Array.isArray(oNode[val.nestedCheck])) {
          if (val.conditional) {
            return val.conditional(oNode[val.nestedCheck]);
          } else {
            return this._compareValue(oNode[val.nestedCheck][0]);
          }
        } else {
          if (val.conditional) {
            return val.conditional(oNode[val.nestedCheck]);
          } else {
            return this._compareValue(oNode[val.nestedCheck]);
          }
        }
      } else {
        if (val.conditional) {
          return val.conditional(oNode[val.nestedCheck]);
        } else {
          return val.value;
        }
      }
    } else {
      return val.value;
    }
  }
}


module.exports = new ECMASorter();