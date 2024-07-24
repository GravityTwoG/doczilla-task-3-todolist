import { fetchTodos } from './api';
import { Observable } from './observable';

export class TodoListModel {
  #todos = new Observable([]);

  #pageSize = new Observable(10);
  #pageNumber = new Observable(1);

  #fromMs = new Observable(null);
  #toMs = new Observable(null);
  #status = new Observable(null);

  #sort = new Observable('byDateAsc'); // byDateAsc, byDateDesc

  #query = {
    type: 'all', // all, byDate, byName
    q: null,
  };

  init = async () => {
    await this.loadTodos(1);
  };

  loadTodos = async (pageNumber) => {
    const todos = await fetchTodos({
      ...this.#query,
      limit: this.#pageSize.get(),
      offset: (pageNumber - 1) * this.#pageSize.get(),
      from: this.#fromMs.get(),
      to: this.#toMs.get(),
      status: this.#status.get(),
    });
    this.#pageNumber.set(pageNumber);

    this.#todos.set(
      todos.sort((a, b) => {
        if (this.#sort.get() === 'byDateAsc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }

        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
    );
  };

  loadTodosByStatus = async (status) => {
    this.#query.type = 'byDate';
    this.#status.set(status);
    this.#query.q = null;
    this.#prepareQuery();

    await this.loadTodos(1);
  };

  loadTodosByDates = async (fromMs, toMs) => {
    this.#query.type = 'byDate';

    this.#fromMs.set(fromMs === null ? this.#fromMs.get() : fromMs);
    this.#toMs.set(toMs === null ? this.#toMs.get() : toMs);

    this.#status.set(
      typeof this.#status.get() === 'boolean' ? this.#status.get() : false
    );

    this.#query.q = null;
    this.#prepareQuery();

    await this.loadTodos(1);
  };

  #prepareQuery = () => {
    if (this.#fromMs.get() === null) {
      this.#fromMs.set(0);
    }
    if (this.#toMs.get() === null) {
      this.#toMs.set(Date.now());
    }
  };

  loadTodosByName = async (name) => {
    this.#query.type = 'byName';
    this.#query.q = name;

    this.#fromMs.set(null);
    this.#toMs.set(null);
    this.#status.set(null);

    await this.loadTodos(1);
  };

  sortBy = async (sort) => {
    this.#sort.set(sort);
    await this.loadTodos(this.#pageNumber.get());
  };

  getTodos = () => {
    return this.#todos;
  };

  getPageSize = () => {
    return this.#pageSize;
  };

  getPageNumber = () => {
    return this.#pageNumber;
  };

  getFromMs = () => {
    return this.#fromMs;
  };

  getToMs = () => {
    return this.#toMs;
  };

  getStatus = () => {
    return this.#status;
  };

  getSort = () => {
    return this.#sort;
  };
}
