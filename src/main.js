import './style.css';

import { fetchTodos } from './api';

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

  const search = document.querySelector('#search');
  search.addEventListener('input', async (event) => {
    await model.loadTodosByName(event.target.value);
    todoListView.setTodos(model.getTodos());
  });

  await model.init();

  todoListView.setTodos(model.getTodos());
});

class TodoListView {
  constructor(element) {
    this.list = element;
  }

  setTodos(todos) {
    // remove all children
    this.list.replaceChildren();

    const todoElements = todos.map((todo) => {
      const todoElement = this.createTodoElement(todo);

      return todoElement;
    });

    this.list.append(...todoElements);
  }

  createTodoElement(todo) {
    const todoElement = document.createElement('li');

    todoElement.classList.add('todo');

    const dateString = Intl.DateTimeFormat('ru', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(todo.date));

    const todoContent = document.createElement('div');
    todoContent.classList.add('todo__content');

    const todoInfo = document.createElement('div');
    todoInfo.classList.add('todo__info');

    const todoTitle = document.createElement('p');
    todoTitle.classList.add('todo__title');
    todoTitle.textContent = todo.name;

    const todoDescription = document.createElement('p');
    todoDescription.classList.add('todo__description');
    todoDescription.textContent = todo.shortDesc;

    todoInfo.append(todoTitle, todoDescription);

    const todoCheckbox = document.createElement('div');
    todoCheckbox.classList.add('todo__checkbox');

    const todoCheckboxInput = document.createElement('input');
    todoCheckboxInput.type = 'checkbox';
    todoCheckboxInput.checked = todo.status;
    todoCheckboxInput.disabled = true;

    todoCheckbox.append(todoCheckboxInput);

    todoContent.append(todoInfo, todoCheckbox);

    const todoDate = document.createElement('div');
    todoDate.classList.add('todo__date');

    const todoDateContent = document.createElement('time');
    todoDateContent.dateTime = todo.date;
    todoDateContent.textContent = dateString;

    todoDate.append(todoDateContent);

    todoElement.append(todoContent, todoDate);

    return todoElement;
  }
}
