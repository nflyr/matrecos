import { vjsx, loadSVG } from "./modules/core/jsx-runtime";
/** @jsx vjsx */

import "./global.css";
import "./aux-icon-sprite.css";


// SVG sprite

loadSVG("/icon-sprite-001.svg", "hidden");

/**
 * KNOWN SYMBOLS INSIDE THE ICON SPRITE
 */
const SPRITE = [
  ["Menu", "icon-Menu"],
  ["Info", "icon-Info"],
  ["Exclamation", "icon-Exclamation"],
  ["Warning", "icon-Warning"],
  ["Download", "icon-Download"],
  ["Download-doc", "icon-Download-doc"],
  ["Reload", "icon-Reload"],
  ["Trend-down", "icon-Trend-down"],
  ["Trend-up", "icon-Trend-up"],
  ["Trend-updown", "icon-Trend-updown"],
  ["Trend-downup", "icon-Trend-downup"],
  ["At", "icon-At"],
  ["Send", "icon-Send"],
  ["Fire", "icon-Fire"],
  ["Love", "icon-Love"],
  ["Bug", "icon-Bug"],
  ["Calendar", "icon-Calendar"],
  ["Discs", "icon-Discs"],
  ["Clock", "icon-Clock"],
  ["Prompt", "icon-Prompt"],
  ["Engine", "icon-Engine"],
  ["Planet", "icon-Planet"],
  ["Lock", "icon-Lock"],
  ["Unlock", "icon-Unlock"],
  ["Search", "icon-Search"],
  ["Forbidden", "icon-Forbidden"],
  ["Play", "icon-Play"],
  ["Pause", "icon-Pause"],
  ["Stop", "icon-Stop"],
  ["Power", "icon-Power"],
  ["Edit", "icon-Edit"],
  ["X", "icon-X"],
];

/**
 * Draw Main container (dashboard)
 */
function IConLine({ title, icon }) {
  return (
    <li>
      <span>{title}</span>
      <svg class="svg-icon">
        <use href={`#${icon}`}></use>
      </svg>
    </li>
  );
}

/**
 * Draw body
 */
function Body() {
  return (
    <div class="icon-board">
      <h1>
        <a href="https://heroicons.com/" target="_blank">
          Heroicons
        </a>
      </h1>
      <ul>
        {SPRITE.map((row) => (
          <IConLine title={row[0]} icon={row[1]} />
        ))}
      </ul>
    </div>
  );
}

// draw the whole thing

document.body.appendChild(Body());
