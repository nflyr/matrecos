import { vjsx, vjsxf, appendChild, loadSVG } from "./modules/core/jsx-runtime";
/** @jsx vjsx */
/** @jsxFrag vjsxf */

import vjs from "./modules/core/js-vanilla";

import "./global.css";
import "./app.css";
import "./modules/template/template.css";
import AppHeader from "./AppHeader";
import AppMain, { activateMonitors } from "./AppMain";

//load icons
loadSVG("/icon-sprite-001.svg", "hidden");

//render application main screen
appendChild(vjs.gid("app"), App());

//activate/render real time monitors
activateMonitors(vjs.qry("main"));

/**
 * Draw Main Container
 */
function App() {
  return (
    <>
      <AppHeader panel="app-config" />
      <AppMain />
      <EditorPanel title="Relatórios em Excel" />
    </>
  );
}

//report form

import ReportOptionsForm from "./modules/monitors/ReportOptionsForm";

/**
 * Config a simple DIV to play as Editor/Config/Alert panel
 */
function EditorPanel({ title, logo, style }) {
  const did = "app-config";

  //close the panel
  const close = (e) => {
    e.preventDefault();
    vjs.addClass(vjs.gid("app-config"), "hidden");
    return false;
  };

  return (
    <article id={did} class="hidden">
      <header id={`${did}-header`}>
        <svg role="img">
          <use href={`#${logo ?? "icon-Stop"}`}></use>
        </svg>
        <h1>{title}</h1>
        <a href="#" onClick={close}>
          <svg role="img">
            <use href="#icon-X"></use>
          </svg>
        </a>
      </header>
      <div id={`${did}-body`}>
        <ReportOptionsForm />
      </div>
    </article>
  );
}
