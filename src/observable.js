export class Observable {
  #value;
  constructor(value) {
    this.#value = value;
    this.observers = [];
  }

  set(value) {
    const oldValue = this.#value;
    this.#value = value;

    if (this.#isPrimitive(value) && oldValue !== value) {
      this.#notify();
    } else {
      this.#notify();
    }
  }

  get() {
    return this.#value;
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  #notify() {
    this.observers.forEach((observer) => observer(this.#value));
  }

  #isPrimitive(value) {
    return typeof value !== 'object';
  }
}
