import './style.css';

import { fetchTodos } from './api';
import { Observable } from './observable';

import { TodoSearchView } from './TodoSearchView';
import { TodoListView } from './TodoListView';
import { PaginatorView } from './PaginatorView';

class TodoListModel {
  #todos = new Observable([]);
  #pageSize = new Observable(10);
  #pageNumber = new Observable(1);

  #query = {
    type: 'all', // all, byDate, byName

    from: null,
    to: null,
    status: null,

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
    });
    this.#pageNumber.set(pageNumber);

    this.#todos.set(todos);
  };

  loadTodosByStatus = async (status) => {
    this.#query.type = 'byDate';
    if (this.#query.from === null) {
      this.#query.from = 0;
      this.#query.to = Date.now();
    }
    this.#query.status = status;

    this.#query.q = null;

    await this.loadTodos(1);
  };

  loadTodosByDates = async (fromMs, toMs) => {
    this.#query.type = 'byDate';
    this.#query.from = fromMs;
    this.#query.to = toMs;
    this.#query.status =
      this.#query.status === false || this.#query.status === true
        ? this.#query.status
        : false;

    this.#query.q = null;

    await this.loadTodos(1);
  };

  loadTodosByName = async (name) => {
    this.#query.type = 'byName';
    this.#query.q = name;

    this.#query.from = null;
    this.#query.to = null;
    this.#query.status = null;

    await this.loadTodos(1);
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
}

document.addEventListener('DOMContentLoaded', async () => {
  const model = new TodoListModel();

  const todoList = document.querySelector('#todoList');

  const todoListView = new TodoListView(todoList);

  const statusFilter = document.querySelector('#statusFilter');
  statusFilter.addEventListener('change', async (event) => {
    await model.loadTodosByStatus(event.target.checked);
  });

  const todayFilter = document.querySelector('#todayFilter');
  todayFilter.addEventListener('click', async () => {
    await model.loadTodosByDates(Date.now() - 24 * 60 * 60 * 1000, Date.now());
  });

  const weekFilter = document.querySelector('#weekFilter');
  weekFilter.addEventListener('click', async () => {
    await model.loadTodosByDates(
      Date.now() - 7 * 24 * 60 * 60 * 1000,
      Date.now()
    );
  });

  const dateFilter = document.querySelector('#dateFilter');
  dateFilter.addEventListener('change', async (event) => {
    await model.loadTodosByDates(
      new Date(event.target.value).getTime(),
      Date.now()
    );
  });

  const searchForm = document.querySelector('#searchForm');

  new TodoSearchView(searchForm, async (searchQuery) => {
    await model.loadTodosByName(searchQuery);
  });

  const paginatorView = new PaginatorView(
    document.querySelector('#paginator'),
    (pageNumber) => {
      model.loadTodos(pageNumber);
    }
  );

  model.getTodos().subscribe((todos) => todoListView.setTodos(todos));

  model
    .getPageNumber()
    .subscribe((pageNumber) => paginatorView.setPageNumber(pageNumber));

  model.getTodos().subscribe((todos) => {
    paginatorView.setHasMore(todos.length >= model.getPageSize().get());
  });

  await model.init();
});
