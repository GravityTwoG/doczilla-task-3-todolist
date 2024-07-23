export class PaginatorView {
  constructor(parent, onPageChange) {
    this.parent = parent;
    this.onPageChange = onPageChange;
    this.hasMore = 1;
    this.pageNumber = 1;

    this.parent.addEventListener('click', this.#onPageClick.bind(this));
  }

  destroy() {
    this.parent.replaceChildren();
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
        label: 'prev',
      });
    }

    pages.push({
      number: currentPageNumber,
      label: 'current',
    });

    if (hasMore) {
      pages.push({
        number: currentPageNumber + 1,
        label: 'next',
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

  #onPageClick(event) {
    const pageNumber = parseInt(event.target.dataset.pageNumber);
    if (!pageNumber) {
      return;
    }

    this.onPageChange(pageNumber);
  }
}
