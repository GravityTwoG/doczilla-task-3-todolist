import './style.css';

import { getStartOfTheDay, getStartOfTheWeek, MS_PER_DAY } from './utils';

import { TodoSearchView } from './TodoSearchView';
import { TodoListView } from './TodoListView';
import { PaginatorView } from './PaginatorView';
import { TodoListModel } from './TodoListModel';

const dateLongFormat = new Intl.DateTimeFormat('ru-RU', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

document.addEventListener('DOMContentLoaded', async () => {
  const model = new TodoListModel();

  const onlyNotDoneFilter = document.querySelector('#onlyNotDoneFilter');
  onlyNotDoneFilter.addEventListener('change', async (event) => {
    await model.loadTodosByStatus(event.target.checked === true ? false : null);
  });

  const todayFilter = document.querySelector('#todayFilter');
  todayFilter.addEventListener('click', async () => {
    const now = Date.now();
    await model.loadTodosByDates(getStartOfTheDay(now), now);
  });

  const weekFilter = document.querySelector('#weekFilter');
  weekFilter.addEventListener('click', async () => {
    const now = Date.now();
    await model.loadTodosByDates(getStartOfTheWeek(now), now);
  });

  const dateFrom = document.querySelector('#dateFrom');
  dateFrom.addEventListener('change', async (event) => {
    const time = new Date(event.target.value).getTime();
    console.log(time, new Date(event.target.value));
    await model.loadTodosByDates(getStartOfTheDay(time), null);
  });

  const dateTo = document.querySelector('#dateTo');
  dateTo.addEventListener('change', async (event) => {
    const time = new Date(event.target.value).getTime();
    await model.loadTodosByDates(null, getStartOfTheDay(time) + MS_PER_DAY - 1);
  });

  const dateSort = document.querySelector('#dateSort');
  dateSort.addEventListener('change', async (event) => {
    model.sortBy(event.target.value);
  });

  const todosStartingDate = document.querySelector('#todosStartingDate');
  model.getTodos().subscribe((todos) => {
    const date = new Date(todos.length ? todos[0].date : Date.now());
    todosStartingDate.textContent = dateLongFormat.format(date);
  });

  const errorContainer = document.querySelector('#error');
  model.getError().subscribe((error) => {
    if (error) {
      const errorElement = document.createElement('div');
      errorElement.classList.add('error');
      errorElement.textContent = error;
      errorContainer.replaceChildren(errorElement);
    } else {
      errorContainer.replaceChildren();
    }
  });

  new TodoSearchView(
    document.querySelector('#searchForm'),
    async (searchQuery) => {
      await model.loadTodosByName(searchQuery);
    }
  );

  const paginatorView = new PaginatorView(
    document.querySelector('#paginator'),
    (pageNumber) => {
      model.loadTodos(pageNumber);
    }
  );

  const todoListView = new TodoListView(document.querySelector('#todoList'));

  model.getTodos().subscribe((todos) => todoListView.setTodos(todos));

  model
    .getPageNumber()
    .subscribe((pageNumber) => paginatorView.setPageNumber(pageNumber));

  model.getTodos().subscribe((todos) => {
    paginatorView.setHasMore(todos.length >= model.getPageSize().get());
  });

  model.getFromMs().subscribe((fromMs) => {
    dateFrom.value = new Date(fromMs).toISOString().split('T')[0];
  });

  model.getToMs().subscribe((toMs) => {
    dateTo.value = new Date(toMs).toISOString().split('T')[0];
  });

  model.getStatus().subscribe((status) => {
    onlyNotDoneFilter.checked = status === false;
  });

  const now = Date.now();
  await model.loadTodosByDates(getStartOfTheWeek(now), now);
});
