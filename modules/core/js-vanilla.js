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
function gid(id) {
  return (id !== undefined && document.getElementById(id)) || null;
}

/**
 * Wraps "(document|element).querySelector(...)".
 * @param {*} selector The selector string to use for query
 * @param {*} element optional, to call the selector on the element
 * @returns The first element found or null
 */
function qry(selector, element) {
  const e = isNode(element) ? element : document;
  return e.querySelector(selector ?? "*");
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
 * Best attempt to check if an object is a DOM Node.
 * @param {*} obj
 * @returns True if the object has nodeName and nodeType attribues
 */
function isNode(obj) {
  return typeof obj === "object" && typeof obj.nodeName === "string" && typeof obj.nodeType === "number";
}

/**
 * Add a class name to the class list property of a element.
 * @param {*} elem The element to change, or it's ID
 * @param {*} clazz The class name to add
 * @returns undefined
 */
function addClass(elem, clazz) {
  const el = (elem?.classList && elem) || gid(elem);
  if (el?.classList && clazz) el.classList.add(clazz);
}

/**
 * Remove a class name from the class list property of a element.
 * @param {*} elem The element to change
 * @param {*} clazz The class name to add
 * @returns undefined
 */
function removeClass(elem, clazz) {
  const el = (elem?.classList && elem) || gid(elem);
  if (el?.classList && clazz) el.classList.remove(clazz);
}

/**
 * Show an element by defaulting the display style property.
 * @param {*} elem The element to change
 * @returns undefined
 */
function show(elem) {
  const el = (elem?.style && elem) || gid(elem);
  if (el?.style) {
    el.style.display = "";
    removeClass(el, "ocrid-hidden"); //just in case
  }
}

/**
 * Hide an element by setting the display style to 'none'.
 * @param {*} elem The element to change
 * @returns undefined
 */
function hide(elem) {
  const el = (elem?.style && elem) || gid(elem);
  if (el?.style) {
    el.style.display = "none";
    addClass(el, "ocrid-hidden"); //just in case
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
 * Insert children into a new field.
 * @param {*} elem The element to change
 * @param {*} data The new data to insert into the element
 * @returns undefined
 */
function append(elem, data) {
  if (Array.isArray(data)) {
    data.forEach((d) => append(elem, d));
  } else if (isNode(data)) {
    elem.appendChild(data);
  } else {
    elem.appendChild(document.createTextNode(typeof data === "object" ? JSON.stringify(data) : data));
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
  append(elem, data);
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
 * Bing a specific event to a function for an element.
 * @param {*} elem The target element
 * @param {*} name Name of the event to bind
 * @param {*} fn The function to execute
 * @returns The event.
 */
function bind(elem, name, fn) {
  if (typeof fn !== "function") {
    console.log("BIND " + name + " to " + JSON.stringify(elem) + " failed because fn [" + fn + "] is not a function");
    return;
  }
  let cap = {
    func: (e) => {
      e.preventDefault();
      fn.call();
      return false;
    },
  };
  elem.addEventListener(name, cap.func.bind(cap), false);
}

/**
 * The exported object
 */

const vjs = {
  onLoad: onLoad,
  gid: gid,
  qry: qry,
  isNode: isNode,
  addClass: addClass,
  removeClass: removeClass,
  show: show,
  hide: hide,
  empty: empty,
  append: append,
  replace: replace,
  formatDateTime: formatDateTime,
  formatDate: formatDate,
  bind: bind,
};

export default vjs;
