/*
Component: OMDb
File     : OMDb-worker.js
 Author  : nflyr (luisf.aff@gmail.com) 
Licence  : IDGAF
Versions : 
   2023.05.05 (v1) - Initial version
   aaaa.mm.dd (v?) - Description...
Description/Usage: 
   Implements an async worker to fetch data from the OMDB API (Online Movie Database).
   This worker implements two API methods: Movie search and Movie fetch (by index).
   The omdb.js file implements a widget client for this worker.
*/

//
// Local storage of movie API and remote search/fetch query strings.
//
const ROOT = "http://www.omdbapi.com/?apikey=91c78bc0";
const OMBD_SEARCH = ROOT + "&s={{title}}&type={{type}}&y={{year}}";
const OMBD_FINDONE = ROOT + "&i={{index}}";

// 
// local storage / state.
//
const MOVIE_DB = {};


//
// Function to fetch remote data from Server
//

const fetchServerData = async function (url) {
   try {
      const response = await fetch(url);
      return await response.json();
   } catch (e) {
      console.log("ERROR: " + JSON.stringify(e));
      return e;
   }
};


//
// Handle a (async) feedback message on API returning data 
//
const onmessage = function (e) {
   
   console.log("Module.OMDb.worker: Searching for movies...");

   switch (e.data[0]) {
      case "search":
         const query = OMBD_SEARCH
            .replace("{{title}}", e.data[1])
            .replace("{{type}}", e.data[2])
            .replace("{{year}}", e.data[3]);

         console.log("Movie Worker: Searching for movies...");

         fetchServerData(query).then((data) =>
            postMessage(data)
         );
         break;

      case "fetch":
         console.log("Movie Worker: Fetch movie #" + e.data[1]);

         const key = e.data[1];

         const data = MOVIE_DB[key];

         if (data !== undefined) {
            console.log("Cache HIT");
            postMessage(data);
         } else {
            console.log("Cache MISS");
            const query = OMBD_FINDONE.replace("{{index}}", key);
            fetchServerData(query).then((data) => {
               MOVIE_DB[key] = JSON.parse(JSON.stringify(data));
               postMessage(data);
            });
         }
         break;

      default:
         postMessage("UNKNOWN OPTION: " + e[0]);
   }

};

self.addEventListener('message', onmessage);
