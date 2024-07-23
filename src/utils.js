export function debounce(callee, timeoutMs) {
  let lastCall = 0;
  let lastCallTimer = null;

  return (...args) => {
    let previousCall = lastCall;

    lastCall = Date.now();

    if (previousCall && lastCall - previousCall <= timeoutMs) {
      clearTimeout(lastCallTimer);
    }

    lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
  };
}

export const MS_PER_DAY = 86400 * 1000;

export function getStartOfTheDay(dateMs) {
  const beginning = dateMs - (dateMs % MS_PER_DAY);
  return beginning;
}

export function getStartOfTheWeek(dateMs) {
  const date = new Date(dateMs);
  const day = date.getDay();

  const beginningDay = dateMs - day * MS_PER_DAY;
  return getStartOfTheDay(beginningDay);
}
