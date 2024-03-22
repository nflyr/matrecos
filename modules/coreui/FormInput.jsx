import { vjsx } from "../core/jsx-runtime";
/** @jsx vjsx */

/**
Component: coreui / Form Input (see available types bellow)
File     : FormInput.jsx
Author   : nflyr (luisf.aff@gmail.com)
Licence  : IDGAF
Versions :
 - 2024.02.19 (v1) - Initial version
 - aaaa.mm.dd (v?) - Description...

Builds a generic form component for data input
The initial purpose of this object was to show data inside the body of a `Card` widget.

## Usage

The general build rule is to pass the following object pattern:
```
props: {
  type
    \text
    \textarea
    \password
    \email
    \url
    \date
    \time
    \file
    \range
    \hidden
    \checkbox
    \radio
    \select
  id
  elemName  (to use on the "name" attribute)
  className (to use on the "class" attribute)
  value
  disabled
  readonly
  placeholder - (text, email, url, textarea, password)
  minlength   - (text, email, url, textarea)
  maxlength   - (text, email, url, textarea)
  min         - (date, time, range)
  max         - (date, time, range)
  step        - (date, time, range)
  accept      - (file)
  checked     - (checkbox, radio)
  rows        - (textarea)
  custom {
    name
    value
  }
}

## Styling

For alignment, expects the following classes exist: `.text-align-[left|center|right|justify]`,
assingned down the path to the `<TD>` element of the tables being renderd.

## Alerts / Highlights

For Alignment, assumes class '.text-align-[L|C|R|J]'
appends className to 'class' on both headers and data

*/
export function FormInput(props) {
  switch (props.type) {
    case "hidden":
      return InputHidden(props);
      break;
    case "file":
      return InputFile(props);
      break;
    case "checkbox":
    case "radio":
      return InputCheckOrRadio(props);
      break;

    case "text":
    case "email":
    case "url":
    case "password":
      return InputTextBased(props);
      break;

    case "date":
    case "time":
    case "range":
      return InputDateTimeOrRange(props);
      break;

    case "textarea":
      return InputTextArea(props);
      break;

    case "select":
      props.type = "text";
      props.placeholder = "** NOT IMPLEMENTED **";
      return InputTextBased(props);
      break;

    default:
      console.log(`Sorry, we are out of ${props.type}.`);
      return <select className="NOT IMPLEMENTED"></select>;
  }
}

/* aux: build a hidden input (simplest).
   props:
    id, elemName, value
*/
function InputHidden(props) {
  return <input type="hidden" id={props.id} name={props.elemName} value={props.value}></input>;
}

/* aux: build a file input (simplest).
   props:
    id, elemName, className
    accept
*/
function InputFile(props) {
  return <input type="file" id={props.id} name={props.elemName} class={props.className} accept={props.accept}></input>;
}

/* aux: build a checkbox or radio input.
   props:
    type(checkbox|radio), id, elemName, className, value
    checked
*/
function InputCheckOrRadio(props) {
  return (
    <input
      type={props.type}
      id={props.id}
      name={props.elemName}
      class={props.className}
      value={props.value}
      checked={props.checked}
    ></input>
  );
}

/* aux: build a text based input.
   props:
    type(text|email|url|password), id, elemName, className, value
    placeholder, minlength(*not for password), maxlength(*not for password)
*/
function InputTextBased(props) {
  return (
    <input
      type={props.type}
      id={props.id}
      name={props.elemName}
      class={props.className}
      value={props.value}
      placeholder={props.placeholder}
      minlength={props.minlength}
      maxlength={props.maxlength}
    ></input>
  );
}

/* aux: build an input for date/time or range components.
   props:
    type(date|time|range), id, elemName, className, value
    min, max, step
*/
function InputDateTimeOrRange(props) {
  return (
    <input
      type={props.type}
      id={props.id}
      name={props.elemName}
      class={props.className}
      value={props.value}
      min={props.min}
      max={props.max}
      step={props.step}
    ></input>
  );
}

/* aux: build an input for textarea.
   props:
    id, elemName, className, value
    placeholder, minlength, maxlength, rows
*/
function InputTextArea(props) {
  return (
    <textarea
      type={props.type}
      id={props.id}
      name={props.elemName}
      class={props.className}
      placeholder={props.placeholder}
      minlength={props.minlength}
      maxlength={props.maxlength}
      rows={props.rows}
    >
      {props.value}
    </textarea>
  );
}

export default FormInput;
