/**
Component: core-struct / Tabular Data
File     : Tabular.js
Author   : nflyr (luisf.aff@gmail.com)
Licence  : EUPL
Versions :
 - 2024.10.23 (v1) - Initial version
 - aaaa.mm.dd (v?) - Description...

Generic container for tabular data.
Initialization may be performed using metadata, only data or both.

## Usage

TODO

*/

/**
 * Tabular Metadata constructor.
 *    props.attr (optional) Metadadata attributes
 *    props.data (optional) Tabular data
 * @param {*} props (optional) Object with Metadata and Data
 */
export function Tabular(props) {
  /* Parse Attributes.
    'props.attr' is an (optional) array of objects, each with the following field:
    - name   (String)
    - type   (string|number|boolean|date|timestamp)
    - maxlen (for stings)
    - pattern (for string)
    - decimals (for number)
    - max    (for number)
    - min    (for number)
  */

  this.attr = null;
  if (Array.isArray(props.attr)) {
    this.attr = props.attr.map((att, i) => {
      return {
        name: att.name ?? "col_" + i,
        type: att.type ?? "string",
        maxlen: att.maxlen ?? undefined,
        pattern: att.pattern ?? undefined,
        decimals: att.decimals ?? undefined,
        max: att.max ?? undefined,
        min: att.min ?? undefined,
      };
    });
  }

  /* Parse Data.
    `props.data` is an (optional) array of objects and/or arrays used to initialize
    the object's data. There is a specific function to assign this data later.
  */

  this.data = null;
  if (Array.isArray(props.data)) {
    this.data = props.data.map((row, i) => {
      if(Array.isArray(row)) {
        for(let j = 0; j < row.length; j++) {
          row[j] = this.cast(row[j], this.attr[j].type);
        }
        return row;
      } else {
        return Object.entries(row).map(([key, value]) => {
          const att = this.attr.find((a) => a.name === key);
          return this.cast(value, att?.type ?? "string");
        });
      }
    });
  }

  /**
   * Cast value to type.
   * @param {*} value Value to cast
   * @param {*} type Type to cast to
   * @returns Casted value
   */
  this.cast = (value, type) => {
    switch (type) {
      case "string":
        return value.toString();
      case "number":
        return parseFloat(value);
      case "boolean":
        return value === true || value === "true" || value === 1;
      case "date":
        return new Date(value);
      case "timestamp":
        return new Date(value * 1000);
      default:
        return value;
    }
  };

  /**
   * Assign data to the object.
   * @param {*} data Data to assign
   */
  this.setData = (data) => {
    if (Array.isArray(data)) {
      this.data = data.map((row, i) => {
        if(Array.isArray(row)) {
          for(let j = 0; j < row.length; j++) {
            row[j] = this.cast(row[j], this.attr[j].type);
          }
          return row;
        } else {
          return Object.entries(row).map(([key, value]) => {
            const att = this.attr.find((a) => a.name === key);
            return this.cast(value, att?.type ?? "string");
          });
        }
      });
    }
  };

  /**
   * Get data from the object.
   * @returns Data
   */
  this.getData = () => {
    return this.data

      }
      return {
        name: att.name ?? "col_" + i,
        type: att.type ?? "string",
        maxlen: att.maxlen ?? undefined,
        pattern: att.pattern ?? undefined,
        decimals: att.decimals ?? undefined,
        max: att.max ?? undefined,
        min: att.min ?? undefined,
      };
    });
  }
}

//Write a javascript function named Person that returns an objetc with two properties (Name and Age), and a function that retrieves those values
