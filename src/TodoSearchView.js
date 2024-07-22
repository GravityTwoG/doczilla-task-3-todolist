import { fetchTodos } from './api';

import { debounce } from './utils';

import { TodoModalView } from './TodoModalView';

export class TodoSearchView {
  constructor(searchForm, onSubmit) {
    this.foundTodos = [];
    this.onSubmit = onSubmit;
    this.searchForm = searchForm;
    this.searchInput = document.querySelector('#search');
    this.searchResults = document.querySelector('#searchResults');

    this.searchForm.addEventListener('submit', this.#onSubmit.bind(this));

    this.searchInput.addEventListener('focus', this.#onFocus.bind(this));
    this.searchInput.addEventListener('input', this.#onChange.bind(this));
    this.searchInput.addEventListener('blur', this.#onBlur.bind(this));
  }

  destroy() {
    this.searchForm.removeEventListener('submit', this.#onSubmit);

    this.searchInput.removeEventListener('focus', this.#onFocus);
    this.searchInput.removeEventListener('input', this.#onChange);
    this.searchInput.removeEventListener('blur', this.#onBlur);

    this.searchResults.removeEventListener('click', this.#onFoundTodoClick);
  }

  #onSubmit(event) {
    event.preventDefault();
    this.onSubmit(this.searchInput.value);
  }

  #onFocus() {
    searchResults.style.display = 'flex';
    searchResults.addEventListener('click', this.#onFoundTodoClick.bind(this));
  }

  #onChange = debounce(async (event) => {
    this.foundTodos = await fetchTodos({
      type: 'byName',
      limit: 10,
      offset: 0,
      q: event.target.value,
    });

    this.searchResults.replaceChildren();
    this.foundTodos.forEach((todo) => {
      const foundTodoElement = document.createElement('li');
      foundTodoElement.classList.add('found-todo');
      foundTodoElement.textContent = todo.name;
      foundTodoElement.dataset.todoId = todo.id;
      this.searchResults.append(foundTodoElement);
    });
  }, 300);

  #onBlur() {
    setTimeout(() => {
      this.searchResults.removeEventListener(
        'click',
        this.#onFoundTodoClick.bind(this)
      );
      this.searchResults.style.display = 'none';
    }, 300);
  }

  #onFoundTodoClick(event) {
    event.stopPropagation();

    const todoElement = event.target.closest('li.found-todo');
    if (!todoElement) {
      return;
    }

    const todoId = todoElement.dataset.todoId;
    if (!todoId) {
      return;
    }
    const todo = this.foundTodos.find((todo) => todo.id === todoId);
    if (!todo) {
      return;
    }

    const todoModal = new TodoModalView(document.body);
    todoModal.show(todo);
  }
}
