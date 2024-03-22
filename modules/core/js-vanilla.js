/* js */

/**
 * Enqueue function(s) to execute after DOM is loaded.
 * @param {*} fn A function or an array of functions.
 * @returns void
 */
function onLoad(fn) {
  if (typeof fn === "function") {
    document.addEventListener("DOMDocumentLoaded", fn);
    return;
  }
  if (Array.isArray(fn)) {
    fn.forEach((cfn) => {
      if (typeof cfn === "function") document.addEventListener("DOMDocumentLoaded", cfn);
    });
  }
}

/**
 * Wraps "document.getElementById(...)".
 * @param {*} id The id to search for
 * @returns The found element or null
 */
function gebi(id) {
  return (id !== undefined && document.getElementById(id)) || null;
}

/**
 * Wraps "(document|element).querySelector(...)".
 * @param {*} selector The selector string to use for query
 * @param {*} element optional, to call the selector on the element
 * @returns The first element found or null
 */
function qry(selector, element) {
  const mo = element?.querySelector ?? document;
  return mo.querySelector(selector ?? "*");
}

/**
 * Wraps "(document|element).querySelectorAll(...)".
 * @param {*} selector The selector string to use for query
 * @param {*} element optional, to call the selector on the element
 * @returns All the elements found or null
 */
function qryAll(selector, element) {
  const mo = element?.querySelector ?? document;
  return mo.querySelectorAll(selector ?? "*");
}

/**
 * Add a class name to the class list property of a element.
 * @param {*} elem The element to change, or it's ID
 * @param {*} clazz The class name to add
 * @returns undefined
 */
function addClass(elem, clazz) {
  const el = (elem?.classList && elem) || gebi(elem);
  if (el?.classList && clazz) el.classList.add(clazz);
}

/**
 * Remove a class name from the class list property of a element.
 * @param {*} elem The element to change
 * @param {*} clazz The class name to add
 * @returns undefined
 */
function removeClass(elem, clazz) {
  const el = (elem?.classList && elem) || gebi(elem);
  if (el?.classList && clazz) el.classList.remove(clazz);
}

/**
 * Show an element by defaulting the display style property.
 * @param {*} elem The element to change
 * @returns undefined
 */
function show(elem) {
  const el = (elem?.style && elem) || gebi(elem);
  if (el?.style) {
    el.style.display = "";
    removeClass(el, "hidden"); //just in case
  }
}

/**
 * Hide an element by setting the display style to 'none'.
 * @param {*} elem The element to change
 * @returns undefined
 */
function hide(elem) {
  const el = (elem?.style && elem) || gebi(elem);
  if (el?.style) {
    el.style.display = "none";
    addClass(el, "hidden"); //just in case
  }
}

/**
 * Remove all children from a given DOM element.
 * @param {*} elem The element to empty
 * @returns undefined
 */
function empty(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.lastChild);
  }
}

/**
 * Remove all children from a given DOM element and add new.
 * @param {*} elem The element to change
 * @param {*} data The new data to insert into the element
 * @returns undefined
 */
function replace(elem, data) {
  empty(elem);
  if (Array.isArray(data)) {
    data.forEach((d) => replace(d));
  } else {
    elem.appendChild(typeof data === "object" ? data : document.createTextNode(data));
  }
}

/**
 * Format a Date/Time object to a locale String, or ISO.
 * @param {*} date The date/time to format
 * @param {*} iso True if ISO format required
 * @returns A String with Date/Time in local format
 */
function formatDateTime(date, iso) {
  return iso === true ? date.toISOString() : date.toLocaleString();
}

/**
 * Format a Date object to a locale String.
 * @param {*} date The date to format
 * @param {*} iso True if ISO format required
 * @returns A String with Date in local format
 */
function formatDate(date, iso) {
  return formatDateTime(date, iso).substring(0, 10);
}

/**
 * The exported object
 */

const vjs = {
  onLoad: onLoad,
  gebi: gebi,
  qry: qry,
  addClass: addClass,
  removeClass: removeClass,
  show: show,
  hide: hide,
  empty: empty,
  replace: replace,
  formatDateTime: formatDateTime,
  formatDate: formatDate,
};

export default vjs;
