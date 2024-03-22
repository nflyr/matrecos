import { vjsx } from "../../core/jsx-runtime";
/** @jsx vjsx */
/*
Component: contracting
File     : QueueCDV-ui.jsx
Author   : n71013
Licence  : MIT
Versions : 
   2023.07.10 (v1) - Initial version
   aaaa.mm.dd (v?) - Description...

Mantain a Card with the status of Document Validation, updated regularly.

*/

import vjs from "../../core/js-vanilla";
import Card from "../../template/Card";
import Table from "../../template/Table";

//
// Internal routing between worker and rendering.
// The "worker.onmessage" must know de queueCDV instance
// that is associated with the data callback.
// (if more than one instance call on the same page)
var renderDataFn = [];

//
// WEB WORKER under the module context.
//

const worker = !!window.Worker && new Worker(new URL("contracting-worker.js", import.meta.url), { type: "module" });
if (worker == false) console.log("Module.contracting: Your browser does not support Workers");

/**
 * WEB WORKER callback HANDLER
 * Handles messages received from the contracting-worker as result of data fetching
 * and renders the resulting data into the visual componente (Card) created by this widget.
 * @param {*} e The event received from the worker after fetching data from server.
 * @returns nothing...
 */
worker.onmessage = function (e) {
  const LOG_PREFIX = "monitors/contracting/QueueCDV-ui[onmessage]:";
  if (LOG_PREFIX) console.log(LOG_PREFIX + " " + JSON.stringify(e));

  // invoke the handler function for this instance (by creation index)
  const ev = e.data;
  const dataHandler = renderDataFn[ev?.hook];
  if (typeof dataHandler === "function") {
    const data = ev.error ? `${ev.action}: ${ev.error}` : ev.data;
    dataHandler.call(null, data);
  } else {
    console.log(LOG_PREFIX + " Data handler (e.data.hook) missing");
  }
  //
};

//
// Returns a object that can be instructed to render (refresh) or destroy.
//
export function queueCDV(parentNode, props) {
  const renderDataIndex = renderDataFn.length;
  var c_Card;
  var c_CardId = "QueueCDV" + renderDataIndex;

  /**
   * DataHandler - Document validation
   * Render the "document validation pending" table for service "pending".
   * @param {*} data  - The data returned from action "pending"
   */
  function renderBody(data) {
    //table skeleton (binded by modules/template/Table)
    const table = {
      header: [
        { title: "Product" },
        { title: "Qtd", align: "number" },
        { title: "Docs", align: "number" },
        { title: "Max Delay", align: "right" },
        { title: "Older Prop", align: "right" },
      ],
      alerts: [{ type: "warning", column: 6, above: 60 * 30 }],
      body: [],
    };
    // fill in the table body, or signal error (data is a struct)
    if (typeof data === "object") {
      const keys = Object.keys(data);
      if (typeof keys.forEach === "function") {
        keys.forEach((key) => {
          table.body.push([key, data[key].count, data[key].docs, data[key].delayText, data[key].delayProp, data[key].delay]);
        });
      }
    }
    // update the header tiemstamp
    const ch = vjs.gebi(c_CardId + "_header");
    const ct2 = ch.querySelector("h2");
    vjs.replace(ct2, "Updated: " + vjs.formatDateTime(new Date()));
    // replace the old data with fresh data
    const cardBody = vjs.gebi(c_CardId + "_body");
    vjs.replace(cardBody, table.body.length > 0 ? Table(table) : data);
    //handle loop (in seconds)
    if (typeof props?.loop === "number") {
      setTimeout(fetchServerData, props.loop * 1000);
    }
  }

  // Save routing between worker and rendering
  renderDataFn.push(renderBody);

  /**
   * Internal function to invoke the worker to fetch server data
   * @closure props  - Aditional parameters sent by the main function invoker
   */
  function fetchServerData() {
    worker.postMessage({ action: "pending", hook: renderDataIndex, props });
  }

  /**
   * Internal function to render the card
   */
  function renderCard() {
    c_Card = Card({ id: c_CardId, title: "WF - Validação Documental", body: "loading..." });
    parentNode.appendChild(c_Card);
  }

  /**
   * Exposed utility functions to caller
   */
  if (this) {
    this.refresh = () => fetchServerData();
    this.destroy = () => deleteCard();
  }

  // first render

  renderCard();
  fetchServerData(props);

  return this;
}
