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
