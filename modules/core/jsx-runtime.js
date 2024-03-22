import vjs from "./js-vanilla";

const SVGNS = "http://www.w3.org/2000/svg";

/**
 * Append a child element or a text node to an element.
 */
const add = (parent, child) => {
  parent.appendChild(child?.nodeType ? child : document.createTextNode(child));
};

/**
 * Recursivelly append child nodes to a element.
 */
export const appendChild = (parent, child) => {
  if (Array.isArray(child)) {
    child.forEach((nthChild) => appendChild(parent, nthChild));
  } else {
    add(parent, child);
  }
};

/**
 * The main "Vanilla JSX" function.
 * @param {*} tag May be a function or some html element name (eg. 'div')
 * @param {*} props An object with name:value tuples where each one may be
 *                  an element property, or a event handler.
 * @param {*} children Zero or more objects with the element's children.
 * @returns The created element.
 */
export const vjsx = (tag, props, ...children) => {
  if (typeof tag === "function") return tag(props, children);
  let element;
  if ("svg|use".indexOf(tag) > -1) {
    element = document.createElementNS(SVGNS, tag);
    element.setAttribute("xmlns", SVGNS);
  } else {
    element = document.createElement(tag);
  }
  Object.entries(props || {}).forEach(([name, value]) => {
    if (name.startsWith("on") && name.toLowerCase() in window) {
      element.addEventListener(name.toLowerCase().substring(2), value);
    } else {
      if (name === "hidden" || "checked|selected|readonly|disabled".indexOf(name) > -1) {
        element[name] = !!value;
      } else {
        if (value && value != "") {
          element.setAttribute(name, value);
        }
      }
    }
  });
  if (children) appendChild(element, children);
  return element;
};

/**
 * The main "Vanilla JSX" function that handles fragments.
 * @param {*} tag ignored
 * @param {*} children Zero or more objects with the element's children.
 * @returns The children.
 */
export const vjsxf = (tag, ...children) => {
  return children;
};

/**
 * Utility: Insert a SVG file into the document.
 * @param {*} url The location of the SVG file to load
 * @param {*} hideClass A class name to hide the SVG element
 */
export const loadSVG = (url, hideClass) => {
  fetch(url)
    .then((res) => res.text())
    .then((svgText) => {
      let svg = document.createElementNS(SVGNS, "svg");
      svg.setAttribute("xmlns", SVGNS);
      //svg.setAttribute("viewBox", "0 0 24 24");
      if (!!hideClass) vjs.addClass(svg, hideClass);
      svg.innerHTML = svgText;
      document.body.insertBefore(svg, document.body.childNodes[0]);
    });
};
