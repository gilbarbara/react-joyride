const validTabNodes = /input|select|textarea|button|object/;
const TAB_KEY = 9;
let modalElement = null;

function isHidden(element) {
  const noSize = element.offsetWidth <= 0 && element.offsetHeight <= 0;

  if (noSize && !element.innerHTML) return true;

  const style = window.getComputedStyle(element);
  return noSize ? style.getPropertyValue('overflow') !== 'visible' : style.getPropertyValue('display') === 'none';
}

function isVisible(element) {
  let parentElement = element;
  while (parentElement) {
    if (parentElement === document.body) break;
    if (isHidden(parentElement)) return false;
    parentElement = parentElement.parentNode;
  }
  return true;
}

function canHaveFocus(element, isTabIndexNotNaN) {
  const nodeName = element.nodeName.toLowerCase();
  const res = (validTabNodes.test(nodeName) && !element.disabled)
    || (nodeName === 'a' ? element.href || isTabIndexNotNaN : isTabIndexNotNaN);
  return res && isVisible(element);
}

function canBeTabbed(element) {
  let tabIndex = element.getAttribute('tabindex');
  if (tabIndex === null) tabIndex = undefined;
  const isTabIndexNaN = isNaN(tabIndex);
  return (isTabIndexNaN || tabIndex >= 0) && canHaveFocus(element, !isTabIndexNaN);
}

function findValidTabElements(element) {
  return [].slice.call(element.querySelectorAll('*'), 0).filter(canBeTabbed);
}

function interceptTab(node, event) {
  const elements = findValidTabElements(node);
  const { shiftKey } = event;

  if (!elements.length) {
    event.preventDefault();
    return;
  }

  let x = elements.indexOf(document.activeElement);

  if (x === -1 || (!shiftKey && x + 1 === elements.length)) {
    x = 0;
  }
  else {
    x += shiftKey ? -1 : 1;
  }

  event.preventDefault();

  elements[x].focus();
}

function handleKeyDown(e) {
  if (!modalElement) {
    return;
  }

  if (e.keyCode === TAB_KEY) {
    interceptTab(modalElement, e);
  }
}

export function setScope(element) {
  modalElement = element;

  window.addEventListener('keydown', handleKeyDown, false);
}

export function removeScope() {
  modalElement = null;

  window.removeEventListener('keydown', handleKeyDown);
}
