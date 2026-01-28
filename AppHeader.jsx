import { vjsx } from "./modules/core/jsx-runtime";
/** @jsx vjsx */

import vjs from "./modules/core/js-vanilla";

/**
 * Component: Application
 * File     : AppHeader.jsx
 *  Author  : nflyr (luisf.aff@gmail.com)
 * Licence  : EUPL
 * Versions :
 *    2023.07.05 (v1) - Initial version
 *    aaaa.mm.dd (v?) - Description...
 *
 * Implements:
 *   The global header of this application.
 *   The current template pesents credits icons and a "spread menu"
 */

export function AppHeader({ panel }) {
  const openConfig = (e) => {
    e.preventDefault();
    vjs.show(panel);
    return false;
  };

  const powerDownConfirm = `Nota:
Depois de executar este comando, se quiser voltar a utilizar esta página para sacar relatórios, terá que voltar a arrancar o servidor local,
executando o script "monitor.cmd" da pasta "C:\\iapps\\monserver".`;

  const powerDown = (e) => {
    e.preventDefault();
    if (window.confirm(powerDownConfirm) === true) {
      fetch("http://localhost:81/adm/shutdown", {
        method: "POST",
        mode: "no-cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          "User-Agent": "MonitorConsole/1.0.0-DRAFT",
        },
      });
    }
    return false;
  };

  return (
    <header id="app-header">
      <a href="#" alt="Downloads" onClick={openConfig}>
        <svg role="img" class="logo-32">
          <use href="#icon-Download-doc" />
        </svg>
      </a>
      <a href="#" alt="Power down" onClick={powerDown}>
        <svg role="img" class="logo-32">
          <use href="#icon-Power" />
        </svg>
      </a>
      <a href="/aux-icon-sprite.html" alt="Mapa de incones SVG disponíveis" target="_blank">
        <svg role="img" class="logo-32">
          <use href="#icon-Info" />
        </svg>
      </a>
      <a href="/aux-styling.html" alt="Esquema de estilos" target="_blank">
        <svg role="img" class="logo-32">
          <use href="#icon-Trend-up" />
        </svg>
      </a>
      <a href="/mocks/fontvar/mockup.html" alt="Variable Font demo" target="_blank">
        <svg role="img" class="logo-32">
          <use href="#icon-At" />
        </svg>
      </a>
      <a href="/mocks/form-template/ft-template.html" alt="Form template" target="_blank">
        <svg role="img" class="logo-32">
          <use href="#icon-Edit" />
        </svg>
      </a>
      <a href="/mocks/backlight/backlight.html" alt="Backlight" target="_blank">
        <svg role="img" class="logo-32">
          <use href="#icon-Clock" />
        </svg>
      </a>

      <a id="vite-about" href="https://vitejs.dev" target="_blank">
        <img src="/icon-vite.svg" class="logo-24 vite" alt="Vite logo" />
      </a>
      <a id="js-about" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
        <img src="/icon-javascript.svg" class="logo-24 js" alt="JavaScript logo" />
      </a>
      <a id="js-about" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
        <img src="/icon-loading.svg" alt="JavaScript logo" />
      </a>
    </header>
  );
}

export default AppHeader;
