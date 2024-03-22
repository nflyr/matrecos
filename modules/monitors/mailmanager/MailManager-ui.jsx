import { vjsx } from "../../core/jsx-runtime";
/** @jsx vjsx */
/*
Component: mailmanager
File     : MailManager-ui.jsx
 Author  : n71013
Licence  : MIT
Versions : 
   2023.07.10 (v1) - Initial version
   aaaa.mm.dd (v?) - Description...

Mantain a Card with the status of Mail handling on ATC.

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

const worker = !!window.Worker && new Worker(new URL("mailmanager-worker.js", import.meta.url), { type: "module" });
if (worker == false) console.log("Module.mailmanager: Your browser does not support Workers");

/**
 * WEB WORKER callback HANDLER
 * Handles messages received from the mailmanager-worker as result of data fetching
 * and renders the resulting data into the visual componente (Card) created by this widget.
 * @param {*} e The event received from the worker after fetching data from server.
 * @returns nothing...
 */
worker.onmessage = function (e) {
  const LOG_PREFIX = "monitors/mailmanager/mailmanager-ui[onmessage]:";
  if (LOG_PREFIX !== "undefined") console.log(LOG_PREFIX + " " + JSON.stringify(e));
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
export function mailManager(parentNode, props) {
  const renderDataIndex = renderDataFn.length;
  var c_Card;
  var c_CardId = "MailManager" + renderDataIndex;

  /**
   * DataHandler - Mail Manager
   * Render the "mailbox analytics" table for service "analytics".
   * @param {*} data  - The data returned from action "analytics"
   */
  function renderBody(data) {
    // table skeleton (binded by modules/template/Table)
    const table = {
      header: [
        { title: "Mailbox" },
        { title: "Last" },
        { title: "Queue", align: "right" },
        { title: "WIP", align: "right" },
        { title: "Arch", align: "right" },
      ],
      alerts: [
        { type: "warning", column: 3, range: [100, 199] },
        { type: "problem", column: 3, above: 200 },
      ],
      body: [],
    };
    // fill in the table body, or signal error
    if (typeof data.forEach === "function") {
      data.forEach((row) => {
        table.body.push([
          row.mailbox,
          vjs.formatDateTime(new Date(row.lastDate)),
          row.qttInQueue,
          row.qttHandling,
          row.qttArchived,
        ]);
      });
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
    worker.postMessage({ action: "analytics", hook: renderDataIndex, props });
  }

  /**
   * Internal function to render the card
   */
  function renderCard() {
    c_Card = Card({ id: c_CardId, title: "ATC - Mailbox Analytics", body: "loading..." });
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
