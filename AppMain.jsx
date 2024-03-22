import { vjsx } from "./modules/core/jsx-runtime";
/** @jsx vjsx */

import vjs from "./modules/core/js-vanilla";

/**
 * File     : index-Main.jsx
 *  Author  : nflyr (luisf.aff@gmail.com)
 * Licence  : IDGAF
 * Versions :
 *    2023.07.05 (v1) - Initial version
 *    aaaa.mm.dd (v?) - Description...
 *
 * Component:
 *     Application
 * Implements:
 *     The main container, where all the data
 */
import Card from "./modules/template/Card";

//
// MONITOR: Document validation
//
import { queueCDV } from "./modules/monitors/contracting/ContractingQueues-ui";
function initDocValidation(host) {
  const card = new queueCDV(host, { loop: 10 }); //loop for 10 seconds
}

//
// MONITOR: Mail Manager analytics
//
import { mailManager } from "./modules/monitors/mailmanager/MailManager-ui";
function initMailManager(host) {
  const card = new mailManager(host, { loop: 10 }); //loop for 60 seconds
}

/**
 * FORM DEMO
 */
import Demo from "./modules/coreui/Demo";
function initDemo(host) {
  const c = new Demo(host);
}

//
// MONITOR: Sample card with a Table
//
// import { samples as TableSamples } from "./modules/template/Table-Test-Data.json";
// function initSampleCard(host) {
//   const sample = TableSamples["Basic_With_Alerts"];
//   const card = Card({ title: sample.title });
//   const cardBody = Table(sample);
//   host.appendChild(card);
//   vjs.gebi(card.getAttribute("id") + "_body").appendChild(cardBody);
// }

/**
 * Activate Monitors
 * @param {*} host - The HTML root element to hold the monitors
 * @returns
 */
export function activateMonitors(host) {
  //initSampleCard(host);
  initDocValidation(host);
  initMailManager(host);
  //initDocValidation(host); // To check for MultiThread on Specific card, IT WORKS!
  initDemo(host);
}

/**
 * Draw Main container (dashboard)
 */
export function AppMain() {
  return <main id="app-main"></main>;
}

export default AppMain;
