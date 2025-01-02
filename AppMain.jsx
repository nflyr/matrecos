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
//   vjs.gid(card.getAttribute("id") + "_body").appendChild(cardBody);
// }

/**
 * Activate Monitors
 * @param {*} host - The HTML root element to hold the monitors
 * @returns
 */
export function activateMonitors(host) {
    initDemo(host);
}

/**
 * Draw Main container (dashboard)
 */
export function AppMain() {
    return <main id="app-main"></main>;
}

export default AppMain;
