import './style.css';

import { fetchTodos } from './api';

import { TodoSearchView } from './TodoSearchView';
import { TodoListView } from './TodoListView';

class TodoListModel {
  #todos = [];

  #query = {
    type: 'all', // all, byDate, byName

    limit: 10,
    offset: 0,

    from: null,
    to: null,
    status: null,

    q: null,
  };

  init = async () => {
    await this.#loadTodos();
  };

  #loadTodos = async () => {
    const todos = await fetchTodos(this.#query);
    this.#todos = todos;
  };

  loadTodosByStatus = async (status) => {
    this.#query.type = 'byDate';
    if (this.#query.from === null) {
      this.#query.from = 0;
      this.#query.to = Date.now();
    }
    this.#query.status = status;

    this.#query.q = null;

    await this.#loadTodos();
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

    await this.#loadTodos();
  };

  loadTodosByName = async (name) => {
    this.#query.type = 'byName';
    this.#query.q = name;

    this.#query.from = null;
    this.#query.to = null;
    this.#query.status = null;

    await this.#loadTodos();
  };

  getTodos = () => {
    return this.#todos;
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  const model = new TodoListModel();

  const todoList = document.querySelector('#todoList');

  const todoListView = new TodoListView(todoList);

  const statusFilter = document.querySelector('#statusFilter');
  statusFilter.addEventListener('change', async (event) => {
    await model.loadTodosByStatus(event.target.checked);
    todoListView.setTodos(model.getTodos());
  });

  const todayFilter = document.querySelector('#todayFilter');
  todayFilter.addEventListener('click', async () => {
    await model.loadTodosByDates(Date.now() - 24 * 60 * 60 * 1000, Date.now());

    todoListView.setTodos(model.getTodos());
  });

  const weekFilter = document.querySelector('#weekFilter');
  weekFilter.addEventListener('click', async () => {
    await model.loadTodosByDates(
      Date.now() - 7 * 24 * 60 * 60 * 1000,
      Date.now()
    );

    todoListView.setTodos(model.getTodos());
  });

  const dateFilter = document.querySelector('#dateFilter');
  dateFilter.addEventListener('change', async (event) => {
    await model.loadTodosByDates(
      new Date(event.target.value).getTime(),
      Date.now()
    );
    todoListView.setTodos(model.getTodos());
  });

  const searchForm = document.querySelector('#searchForm');

  new TodoSearchView(searchForm, async (searchQuery) => {
    await model.loadTodosByName(searchQuery);
    todoListView.setTodos(model.getTodos());
  });

  await model.init();

  todoListView.setTodos(model.getTodos());
});
