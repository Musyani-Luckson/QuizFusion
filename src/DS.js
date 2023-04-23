export class Stack {
  constructor() {
    this._dataStore = [];
  }

  push(...elements) {
    this._dataStore.push(...elements);
    return this;
  }

  pop() {
    return this._dataStore.pop();
  }

  peek() {
    return this._dataStore[this.size() - 1];
  }

  clear() {
    this._dataStore.length = 0;
    return this;
  }

  size() {
    return this._dataStore.length;
  }

  isEmpty() {
    return this.size() === 0;
  }

  toArray() {
    return [...this._dataStore];
  }

  toString() {
    return this._dataStore.join(', ');
  }

  [Symbol.iterator]() {
    let i = this.size() - 1;
    return {
      next: () => ({
        value: this._dataStore[i--],
        done: i < 0
      })
    };
  }

  *[Symbol.iterator]() {
    for (let i = this.size() - 1; i >= 0; i--) {
      yield this._dataStore[i];
    }
  }

  map(callback) {
    return this._dataStore.map(callback);
  }

  filter(callback) {
    return this._dataStore.filter(callback);
  }

  reduce(callback, initialValue) {
    return this._dataStore.reduce(callback, initialValue);
  }

  forEach(callback) {
    this._dataStore.forEach(callback);
    return this;
  }
}