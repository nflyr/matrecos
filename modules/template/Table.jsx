import { vjsx } from "../core/jsx-runtime";
/** @jsx vjsx */

/**
Component: templates/Table
File     : Card.jsx
Author   : nflyr (luisf.aff@gmail.com)
Licence  : IDGAF
Versions :
 - 2023.07.05 (v1) - Initial version
 - aaaa.mm.dd (v?) - Description...

Builds a generic table from a specific input data structure.
The initial purpose of this object was to show data inside the body of a `Card` widget.

## Usage

The general build rule is to pass the following object pattern:
```
props: {...}, (optional)
header: [
   {title: 'string', [align: 'L|C|R|J'], ...},   <-- alignment will be inherit into rows
   {title: 'string', ...},
   ...
],
body: [
   [{data: 'string', [className= 'string'] }, ..., ...],
   [{data: 'string', ... ],
   ...
]
```
*Note*: `(null|undefined)` will make the cell void but existent.

## Styling

For alignment, expects the following classes exist: `.text-align-[left|center|right|justify]`,
assingned down the path to the `<TD>` element of the tables being renderd.

## Alerts / Highlights

For Alignment, assumes class '.text-align-[L|C|R|J]'
appends className to 'class' on both headers and data

*/
export function CardTable(props) {
  const cols = (Array.isArray(props?.header) && props.header) || [];
  const rows = (Array.isArray(props?.body) && props.body) || [];
  const alerts = (Array.isArray(props.alerts) && props.alerts) || [];
  const align = [];
  // normalize data
  for (let i = 0; i < cols.length; i++) {
    align[i] = (cols[i].align && "text-align-" + cols[i].align) || "";
    cols[i].className = cols[i].className ? cols[i].className.concat(" ", align[i]).trim() : align[i];
    if (!cols[i].title) cols[i].title = "";
  }
  return (
    <table class="template-table">
      <thead>
        <tr>
          {alerts.length ? <th class="text-align-center">- ℹ️ -</th> : ""}
          {cols.map((col) => (
            <th class={col.className}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <TableRow cols={cols} align={align} alerts={alerts} row={row} />
        ))}
      </tbody>
    </table>
  );
}

/* aux: parse and Return a row */
function TableRow(props) {
  let row = props.row;
  const ncols = props.cols.length;
  const align = props.align;
  const alerts = props.alerts;
  let alertCol = "";
  // inspect data and raise alerts
  if (alerts.length > 0) {
    row.forEach((cell, i) => {
      for (let j = 0; j < alerts.length; j++) {
        if (alerts[j].column === i + 1 || alerts[j].column === props.cols[i]?.title) {
          if (alerts[j].range && cell >= alerts[j].range[0] && cell <= alerts[j].range[1]) {
            alertCol = alertTypeImoji(alerts[j].type);
          } else {
            if (alerts[j].rangeOut && (cell < alerts[j].rangeOut[0] || cell > alerts[j].rangeOut[1])) {
              alertCol = alertTypeImoji(alerts[j].type);
            } else {
              if (alerts[j].above !== undefined && cell > alerts[j].above) {
                alertCol = alertTypeImoji(alerts[j].type);
              } else {
                if (alerts[j].values && alerts[j].indexOf(cell) > -1) {
                  alertCol = alertTypeImoji(alerts[j].type);
                }
              }
            }
          }
        }
      }
    });
  }
  if (row.length > ncols) row = row.slice(0, ncols);
  return (
    <tr>
      {alerts.length ? <td class="text-align-center">{alertCol}</td> : ""}
      {row.map((cell, i) => (
        <td class={align[i]}>{cell ?? ""}</td>
      ))}
    </tr>
  );
}

/* defines alert icons as IMOJIs */
const alertTypeImoji = (type) => {
  return {
    info: ["❇️"],
    warning: ["⚠️"],
    problem: ["⛔"],
  }[type];
};

/* defines alert icons as SVGs */
const alertTypeSvg = (type) => {
  switch (type) {
    case "info":
      return (
        <svg role="img" class="svg-alert info">
          <use href="#icon-Info" />
        </svg>
      );
    case "warning":
      return (
        <svg role="img" class="svg-alert warning">
          <use href="#icon-Warning" />
        </svg>
      );
    case "problem":
      return (
        <svg role="img" class="svg-alert problem">
          <use href="#icon-Exclamation" />
        </svg>
      );
    default:
      return (
        <svg role="img" class="alert-svg">
          <use href="#icon-X" />
        </svg>
      );
  }
};

export default CardTable;
