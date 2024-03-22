import { vjsx } from "../core/jsx-runtime";
/** @jsx vjsx */

import vjs from "../core/js-vanilla";

/*
Component: coreui / Form Input *DEMONSTRATION*
File     : Demo.jsx
Author   : mflyr
Licence  : ATGAF
*/

import FormInput from "./FormInput";

export function Demo(host) {
  /*
  MAP OF FIELDS TO INPUT (for Later)
  */

  const fields = {
    field00: {
      type: "password",
      id: "fieldId-0",
      elemName: "name-0",
      className: "class-0",
      placeholder: "place-0,password",
      value: "xxxxx",
      minlength: 8,
      maxlength: 100,
    },
    field01: {
      type: "text",
      id: "fieldId-1",
      elemName: "name-1",
      className: "class-1",
      placeholder: "place-1,text",
      value: "valu-1",
      minlength: 1,
      maxlength: 2,
    },
    field02: {
      type: "email",
      id: "fieldId-2",
      elemName: "name-2",
      className: "class-2",
      placeholder: "place-2,email",
      value: "l@e.pt",
      minlength: 2,
      maxlength: 10,
    },
    field03: {
      type: "url",
      id: "fieldId-3",
      elemName: "name-3",
      className: "class-3",
      placeholder: "place-3,url",
      value: "http://f3.tst",
      minlength: 1,
      maxlength: 10,
    },
    field04: {
      type: "date",
      id: "fieldId-4",
      elemName: "name-4",
      className: "class-4",
      value: "2024-02-19",
      min: "2024-02-01",
      max: "2024-02-28",
    },
    field05: {
      type: "time",
      id: "fieldId-5",
      elemName: "name-5",
      className: "class-5",
      value: "13:30",
      min: "13:00",
      max: "19:00",
    },
    field06: {
      type: "range",
      id: "fieldId-6",
      elemName: "name-6",
      className: "class-6",
      value: "32",
      min: "1",
      max: "88",
      step: "5",
    },
    field07: { type: "file", id: "fieldId-7", elemName: "name-7", className: "class-7", accept: "*/*" },
    field08: {
      type: "textarea",
      id: "fieldId-8",
      elemName: "name-8",
      className: "class-8",
      placeholder: "place-8,textarea",
      value: "Some text for box 8",
      minlength: 1,
      maxlength: 200,
      rows: 3,
    },
    field09: {
      type: "checkbox",
      id: "fieldId-9",
      elemName: "name-9",
      className: "class-9",
      value: "checkbox",
      checked: false,
    },
    field10: { type: "radio", id: "fieldId-10", elemName: "name-10", className: "class-10", value: "radio", checked: true },
    field11: { type: "select", id: "fieldId-11", elemName: "name-11", className: "class-11" },
    field12: { type: "hidden", id: "fieldId-12", elemName: "name-12", value: "12-hidden" },
  };

  host.appendChild(buildForm(fields));
}

/* build a form with a li of fields */
function buildForm(fields) {
  const farray = Object.values(fields);
  return (
    <form onSubmit={evDemoSubmitted}>
      <ul>{farray.map((field) => buildField(field))}</ul>
      <button type="submit">Show Fields</button>
    </form>
  );
}

/* build a LI with a field inside */
function buildField(field) {
  return (
    <li style="color:white;">
      {field.type}: {FormInput(field)}
    </li>
  );
}

const evDemoSubmitted = (e) => {
  const data = new FormData(e.target);
  const args = {};
  for (const arg of data.entries()) {
    //args[arg[0]] = arg[1].name ? arg[1].name : arg[1];
    //console.log(arg[0] + " = " + typeof arg[1]);
    //    args[arg[0]] = arg[1].name ? arg[1].name : arg[1];
    //args[arg[0]] = typeof arg[1] === "object" ? JSON.parse(JSON.stringify(arg[1], ["name", "type", "size"])) : arg[1];
    args[arg[0]] = typeof arg[1] === "object" ? extractFormFileData(arg[1]) : arg[1];
  }
  console.log(JSON.stringify(args));
  e.preventDefault();
  return false;
};

function extractFormFileData(obj) {
  if (obj.name === "undefined" || obj.name === "") {
    return null;
  } else {
    return { name: obj.name, type: obj.type, size: obj.size };
  }
}

export default Demo;
