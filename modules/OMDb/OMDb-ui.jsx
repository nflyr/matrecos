import { vjsx } from "../core/jsx-runtime";
/** @jsx vjsx */

/*
Component: OMDb
File     : OMDb-ui.jsx
 Author  : nflyr (luisf.aff@gmail.com) 
Licence  : IDGAF
Versions : 
   2023.05.05 (v1) - Initial version
   aaaa.mm.dd (v?) - Description...
Description/Usage: 
   Implements two visual components:
   1. A list os results from searching the Movie database.
   2. A form to allow the selection of a type, a field to enter 
      a title, and a button to performe the search.
DOM identification:
   The top elements have a "data-module-id" property with value "OMDb-List" and "OMDb-Search".
*/

/**
 * Script to handle a query for Movie DB.
 * Expects the following base HTML on the page:
 *
 *    <form data-onpage-role="movie-search">
 *       <input data-onpage-role="movie-title" type="text">
 *       <button data-onpage-role="movie-search">Go</button>
 *       <p data-onpage-role="movie-output">(output goes here)</p>
 *    </form>
 *
 */
import vjs from "../core/js-vanilla";

const IMBD_URL = "https://www.imdb.com/title/";

/**
 * Render a Movies in a table row.
 * @param {*} props:
 *    film - The Movie,Serie,Episode to render
 *    key  - (optional) A "data-key" property to uniquely identify the table row
 * @returns A JSX object
 */
function FilmRow(props) {
   const film = (props && typeof props.film === 'object' && props.film) || {};
   const url = IMBD_URL + film.imdbID;
   const key = (typeof props.key === 'string' && props.key) || film.imdbID;
   return (
      <tr data-key={key}>
         <td>
            <a target="_blank" href={url}>
               <img
                  src={film.Poster}
                  width="100"
                  loading="lazy"
                  alt="Movie poster"
               />
            </a>
         </td>
         <td>{film.Title}</td>
         <td>{film.Year}</td>
         <td>{film.imdbID}</td>
         <td>{film.Type}</td>
      </tr>
   );
}

/**
 * Render a list of Movies,Series,Episodes.
 * @param {*} props:
 *    items - A list of Movies,Series,Episodes to render
 * @returns A JSX object
 */
export function OMDbList(props) {
   const films = (props && Array.isArray(props.films)) || [];
   return (
      <table data-module-id="OMDb-List" className="OMDb-List">
         <thead>
            <tr>
               <th>Poster</th>
               <th>Title</th>
               <th>Year</th>
               <th>imdbID</th>
               <th>Type</th>
            </tr>
         </thead>
         <tbody>
            {films.length == 0 && (
               <tr>
                  <td colspan="5">(no items)</td>
               </tr>
            )}
            {films.forEach((film) => (
               <FilmRow film={film} />
            ))}
         </tbody>
      </table>
   );
}

//
//Construct WEB WORKER under the module context.
//

const worker =
   !!window.Worker && new Worker(new URL("OMDb-worker.js", import.meta.url), { type: "module" });
if (worker == false) console.log("Module.OMDb: Your browser does not support Workers");

//
// This is what handles the response from the WEB WORKER
//

worker.onmessage = function (e) {
   console.log("Module.OMDb: Message received from worker");

   //
   // find and empty the element to update
   //

   const filmList = vjs.qry("table[data-module-id='OMDb-List'] tbody");
   while (filmList.firstChild) {
      filmList.removeChild(filmList.lastChild);
   }

   //
   // Prepare film list and render
   //

   const data = e.data;

   if (data.Search[1]) {
      data.Search.sort((a, b) => a.Year - b.Year);
   }

   data.Search.forEach((film) => {
      filmList.appendChild(<FilmRow film={film} />);
   });
};

/**
 * Render a form to query for Movies,Series,Episodes,etc.
 * @param {*} props:
 *    formId - A unique ID to set to the form, avoids failure of query selectors.
 *    formClass - Optional class set on the form.
 * @returns A JSX object
 */
export function OMDbForm(props) {
   /*
FOR LATTER - MAYBE NEDED TO REMOVE THE WORKER ABOVE

//colocar fora da função.
var wwmo = new MutationObserver(function (e) {
  if (e[0].removedNodes && worker) {
      worker.terminate();
      console.log("Module.OMDb: Search Web Worker terminated.");
  }
});
//colocar dentro da função OMDbForm.
wwmo.observe(vjs.gebi(props.formId).parentElement, { childList: true });

*/

   function search(e) {
      e.preventDefault();
      const qForm = vjs.gebi(props.formId);
      const qText = vjs.qry("#" + props.formId + " input[name='title']").value;
      const qYear = vjs.qry("#" + props.formId + " input[name='year']").value;
      const qType = vjs.qry("#" + props.formId + " select[name='type']").value;
      console.log(
         "Module.OMDb.Form: Searching for: " +
         qText +
         ", " +
         qType +
         ", " +
         qYear
      );
      worker.postMessage(["search", qText, qType, qYear]);
      return false;
   }

   return (
      <form data-module-id="OMDb-Form" id={props.formId} className={props.formClass}>
         <div class="search">
            <label for="type">Type</label>
            <select id="type" name="type">
               <option selected value="">
                  Any
               </option>
               <option value="movie">Movie</option>
               <option value="series">Series</option>
               <option value="episode">Episode</option>
            </select>
         </div>
         <div class="search">
            <label for="year">Year</label>
            <input id="year" name="year" type="text"></input>
         </div>
         <div class="search">
            <label for="title">Title</label>
            <input id="title" name="title" type="text"></input>
         </div>
         <button type="button" onClick={search}>
            Search
         </button>
      </form>
   );
}
