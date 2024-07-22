export class TodoModalView {
  constructor(parent) {
    this.parent = parent;
  }

  show(todo) {
    const todoModal = document.createElement('div');
    todoModal.classList.add('todo-modal');

    const todoModalInner = document.createElement('div');
    todoModalInner.classList.add('todo-modal__inner');

    const todoModalHeader = document.createElement('header');
    todoModalHeader.classList.add('todo-modal__header');

    const todoModalTitle = document.createElement('p');
    todoModalTitle.classList.add('todo-modal__title');
    todoModalTitle.textContent = todo.name;

    const todoModalDate = document.createElement('time');
    todoModalDate.classList.add('todo-modal__date');
    todoModalDate.dateTime = todo.date;
    todoModalDate.textContent = Intl.DateTimeFormat('ru', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(todo.date));

    const todoModalCheckbox = document.createElement('button');
    todoModalCheckbox.classList.add('todo-modal__checkbox');

    const todoModalCheckboxInput = document.createElement('input');
    todoModalCheckboxInput.type = 'checkbox';
    todoModalCheckboxInput.checked = todo.status;
    todoModalCheckboxInput.disabled = true;

    todoModalCheckbox.append(todoModalCheckboxInput);

    todoModalHeader.append(todoModalTitle, todoModalDate, todoModalCheckbox);
    todoModalInner.append(todoModalHeader);

    const todoModalContent = document.createElement('div');
    todoModalContent.classList.add('todo-modal__content');
    todoModalContent.textContent = todo.fullDesc;

    const todoModalFooter = document.createElement('div');
    todoModalFooter.classList.add('todo-modal__footer');

    const todoModalClose = document.createElement('button');
    todoModalClose.classList.add('todo-modal__close');
    todoModalClose.textContent = 'Готово';

    todoModalFooter.append(todoModalClose);

    todoModalInner.append(todoModalContent, todoModalFooter);
    todoModal.append(todoModalInner);

    this.parent.append(todoModal);

    this.todoModal = todoModal;
    this.todoModalInner = todoModalInner;
    this.todoModalClose = todoModalClose;

    todoModal.addEventListener('click', this.#onTodoModalClose.bind(this));

    todoModalInner.addEventListener('click', this.#onTodoClick.bind(this));

    todoModalClose.addEventListener('click', this.#onTodoModalClose.bind(this));

    window.addEventListener('keydown', this.#onEscape.bind(this));

    document.body.style.overflow = 'hidden';
  }

  hide() {
    if (!this.todoModal) {
      return;
    }

    this.todoModal.removeEventListener('click', this.#onTodoModalClose);
    this.todoModalInner.removeEventListener('click', this.#onTodoClick);
    this.todoModalClose.removeEventListener('click', this.#onTodoModalClose);

    window.removeEventListener('keydown', this.#onEscape);

    this.todoModal.remove();

    this.todoModal = null;
    this.todoModalInner = null;
    this.todoModalClose = null;

    document.body.style.overflow = 'auto';
  }

  #onTodoModalClose() {
    this.hide();
  }

  #onTodoClick(event) {
    event.stopPropagation();
  }

  #onEscape(event) {
    if (event.key === 'Escape') {
      this.hide();
    }
  }
}
