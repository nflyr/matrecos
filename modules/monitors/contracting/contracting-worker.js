/**
Component: monitor/contracting
File     : contracting-worker.js
Author   : nflyr (luisf.aff@gmail.com)
Licence  : EUPL
Versions :
 - 2023.11.05 (v1) - Initial version
 - aaaa.mm.dd (v?) - Description...

Implements async workers to fetch data related to *contracting*
from the remote monitor server (monserver), and transform/reduce
the data in order to present in mintoring cards.

To find the available methods, 
read the documentation of the function *onmessage*
*/

const LOG_PREFIX = "monitors/contracting/worker";

/**
 * Data REDUCER
 * Transforms "monserver/dv/pending" to a status report table.
 * Assumes data is sorted by contract!
 * !!! THIS CODE SHOULD MOVE INTO SERVER CODE !!!
 */
const reduceDocValStatus = function (data) {
  const reduced = {};
  const aggprop = "businessUnit";
  const cm = new Date().getMonth();
  let lastProp = null;
  //aggregate by "aggprop"
  data.forEach((doc) => {
    let d = new Date(doc.createdOn);
    let ri = reduced[doc[aggprop]];
    if (!ri) {
      ri = reduced[doc[aggprop]] = { count: 0, docs: 0, delay: 0, delayProp: "?" };
    }
    ri.docs = ri.docs + 1;
    if (doc.proposal !== lastProp) {
      ri.count = ri.count + 1;
      lastProp = doc.proposal;
    }
    if (ri.delay < doc.verificationTime) {
      ri.delay = doc.verificationTime;
      ri.delayProp = doc.proposal;
    }
  });
  //format max delay and proposal
  Object.keys(reduced).forEach((key) => {
    let delay = reduced[key].delay,
      dh = 0,
      dm = 0;
    //ds = 0;
    if (delay > 0) {
      dh = Math.floor(delay / 3600); //hrs
      dm = Math.floor((delay - dh * 3600) / 60); //mins
      //ds = delay - (dh * 3600 + dm * 60); //secs
      reduced[key].delayText = dh + ":" + dm + "m"; // + ds + "s";
    }
  });
  return reduced;
};

import { executeRequest } from "../request-proxy";

//
// REMOTE SERVICE MAPPINGS
//

const ROUTER = {
  hi: { path: "/cq/hi" },
  pending: { path: "/cq/dv/pending", reduce: reduceDocValStatus },
  history: { path: "/cq/dv/history?fromDate={{fromDate}}&toDate={{toDate}}" },
};

/**
 * Handle REQUESTS from the UI component.
 * @param {*} e The received event where "e.data" is expected
 * to have the following entries:
 *    action - The worker server action to execute.
 *    params - Aditional parameters (to match fetch API params).
 *    hook   - Some origin/requester object/function to be returned to the requester.
 */
const onmessage = function (e) {
  if (LOG_PREFIX !== "undefined") console.log(LOG_PREFIX + "[onmessage]:data=" + JSON.stringify(e.data));

  const action = e?.data?.action;
  const hook = e?.data?.hook;

  if (!ROUTER[action]) {
    console.log(LOG_PREFIX + "[onmessage]:UNKNOWN ACTION" + action);
    self.postMessage({
      action: action,
      hook: hook,
      error: "UNKNOWN ACTION",
    });
    return;
  }

  // execute remote request

  executeRequest(ROUTER[action].path)
    .then((data) => {
      if (LOG_PREFIX !== "undefined") console.log(LOG_PREFIX + "[executeRequest]:then(ok): "); // + JSON.stringify(data));
      //fetch error
      const error = data.fetchError || false;
      //reduce data
      if (!error && ROUTER[action].reduce) {
        data = ROUTER[action].reduce(data);
      }
      self.postMessage({
        action: action,
        hook: hook,
        data: data,
        error: error,
      });
    })
    .catch((e) => {
      if (LOG_PREFIX !== "undefined") console.log(LOG_PREFIX + "[executeRequest]:catch: " + JSON.stringify(e));
      self.postMessage({
        action: action,
        hook: hook,
        error: "SERVER ERROR (see console log)",
      });
    });
};

self.addEventListener("message", onmessage);
