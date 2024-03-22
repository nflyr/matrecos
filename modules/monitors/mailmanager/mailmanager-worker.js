/**
Component: monitor/mailmanager
File     : mailmanager-worker.js
Author   : nflyr (luisf.aff@gmail.com)
Licence  : IDGAF
Versions :
 - 2023.07.05 (v1) - Initial version
 - aaaa.mm.dd (v?) - Description...

Implements async workers to fetch data related to *mailmanager*
from the remote monitor server (monserver), and transform/reduce
the data in order to present in mintoring cards.

To find the available methods, 
read the documentation of the function *onmessage*
*/

const LOG_PREFIX = "monitors/mailmanager/worker";

import { executeRequest } from "../request-proxy";

//
// REMOTE SERVICE MAPPINGS
//

const ROUTER = {
  hi: { path: "/mm/hi" },
  status: { path: "/mm/status" },
  analytics: { path: "/mm/analytics" },
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
