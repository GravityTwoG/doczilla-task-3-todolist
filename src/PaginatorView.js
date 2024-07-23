export class PaginatorView {
  constructor(parent, onPageChange) {
    this.parent = parent;
    this.onPageChange = onPageChange;
    this.hasMore = 1;
    this.pageNumber = 1;

    this.parent.addEventListener('click', this.#onPageClick);
  }

  destroy() {
    this.parent.replaceChildren();
    this.parent.removeEventListener('click', this.#onPageClick);
  }

  setHasMore(hasMore) {
    this.hasMore = hasMore;
    this.#drawPages(this.hasMore, this.pageNumber);
  }

  setPageNumber(pageNumber) {
    this.pageNumber = pageNumber;
    this.#drawPages(this.hasMore, this.pageNumber);
  }

  #drawPages(hasMore, currentPageNumber) {
    const pages = [];

    if (currentPageNumber > 1) {
      pages.push({
        number: currentPageNumber - 1,
        label: 'Назад',
      });
    }

    pages.push({
      number: currentPageNumber,
      label: 'Текущая',
    });

    if (hasMore) {
      pages.push({
        number: currentPageNumber + 1,
        label: 'Далее',
      });
    }

    this.parent.replaceChildren();

    pages.forEach((page) => {
      const pageElement = document.createElement('li');
      pageElement.classList.add('paginator__page');
      pageElement.textContent = page.label;
      pageElement.dataset.pageNumber = page.number;
      this.parent.appendChild(pageElement);
    });
  }

  #onPageClick = (event) => {
    const pageNumber = parseInt(event.target.dataset.pageNumber);
    if (!pageNumber) {
      return;
    }

    this.onPageChange(pageNumber);
  };
}
