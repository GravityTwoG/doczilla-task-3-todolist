import { TodoModalView } from './TodoModalView';

export class TodoListView {
  constructor(element) {
    this.list = element;

    this.list.addEventListener('click', this.#onTodoClick);
  }

  destroy() {
    this.list.removeEventListener('click', this.#onTodoClick);
  }

  #onTodoClick = (event) => {
    const todoElement = event.target.closest('p.todo__title');
    if (!todoElement) {
      return;
    }

    const todoId = todoElement.dataset.todoId;
    if (!todoId) {
      return;
    }

    const todo = this.todos?.find((todo) => todo.id === todoId);
    if (!todo) {
      return;
    }

    const todoModal = new TodoModalView(document.body);
    todoModal.show(todo);
  };

  setTodos(todos) {
    this.todos = todos;
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
    todoTitle.dataset.todoId = todo.id;

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
