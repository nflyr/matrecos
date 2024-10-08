import { vjsx, loadSVG } from "./modules/core/jsx-runtime";
/** @jsx vjsx */

import "./global.css";
import "./aux-styling.css";

import vjs from "./modules/core/js-vanilla";

/**
 * Draw the main Styling PAD
 */
function Styling() {
  return (
    <div class="nsx-bottom bottom">
      <aside>
        <span class="mono-high">background: var(--clr-bottom-bg)</span>
      </aside>
      <p>
        This text is displayed using <span class="mono-high">color: var(--clr-bottom-text)</span>.
        <br /> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet tempora perferendis, tenetur repellat cumque quae
        sequi eos. Dignissimos, quas quidem!
      </p>
      <div class="nsx-flex">
        <button>⚙️Ok</button>
        <button>Cancel ↙</button>
      </div>
      <div class="nsx-flex f0">
        <div class="nsx-grid g1">
          <div class="nsx-board board">
            <aside>
              <span class="mono-high">background: var(--clr-board-bg)</span>
            </aside>
            <p>
              This text is displayed using <span class="mono-high">color: var(--clr-panel-text)</span>.
              <br /> Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi repellat doloremque quisquam excepturi enim?
              Id maxime, deleniti laborum laudantium sint veniam harum ex itaque cum suscipit aut officiis voluptates et?
            </p>
            <div class="nsx-banner banner">
              <aside>
                <span class="mono-high">background: var(--clr-banner-bg)</span>
              </aside>
              <p>
                This text is displayed using <span class="mono-high">color: var(--clr-banner-text)</span>.
                <br /> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas sed veniam ratione velit voluptate magni
                vel minima explicabo. Repudiandae reprehenderit dicta modi aperiam fugiat perferendis?
              </p>
              <div class="nsx-flex">
                <button>⚙️Ok</button>
                <button>Cancel ↙</button>
              </div>
            </div>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur rerum nulla provident atque pariatur et nisi
              quidem est, ullam neque impedit soluta perferendis blanditiis quo!
            </p>
            <div class="nsx-flex">
              <button>⚙️Ok</button>
              <button>Cancel ↙</button>
            </div>
          </div>
          <div class="nsx-board board">
            <h2>Forms</h2>
            <div class="panel-body">(put some form here)</div>
          </div>
        </div>

        <div className="nsx-grid g2">
          <div class="nsx-board">
            <h2>Font sizes</h2>
            <div class="panel-body">
              <ul>
                <li class="fs_fs_XXS">This font size is var:fs-XXS</li>
                <li class="fs_fs_XS">This font size is var:fs-XS</li>
                <li class="fs_fs_S">This font size is var:fs-S</li>
                <li class="fs_fs_M">This font size is var:fs-M</li>
                <li class="fs_fs_L">This font size is var:fs-L</li>
                <li class="fs_fs_XL">This font size is var:fs-XL</li>
                <li class="fs_fs_XXL">This font size is var:fs-XXL</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// render into the DOM

vjs.gid("app").appendChild(Styling());
