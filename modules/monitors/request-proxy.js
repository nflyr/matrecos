/**
Component: monitors
File     : RequestProxy.js
Author   : nflyr (luisf.aff@gmail.com)
Licence  : IDGAF
Versions :
 - 2023.07.05 (v1) - Initial version
 - aaaa.mm.dd (v?) - Description...

Implements a request handler for repositories, tha manages the
server invocation of services based on a standard pattern, that
includes calling services based on a map of virtual that point
to remote resources.

Data is returned in the original format rendered by the server.

*/

export const monserver = "http://localhost:81"; // CHANGE THIS IF SERVER LOCATION MOVES

/**
 * Fetch data from remote server (all GETs)
 * @param {*} path - Teh relative path to invoke on "monserver" host.
 * @param {*} params - request parameters (fetch configuration)
 * @returns A promise...
 */
export const executeRequest = async function (path, params) {
  try {
    const response = await fetch(`${monserver}` + path);
    return await response.json();
  } catch (e) {
    //    console.log("monitors/request-proxy[executeRequest]: ERROR: " + JSON.stringify(e));
    console.log(`monitors/request-proxy[executeRequest]: ERROR: ${e?.message}`);
    return { fetchError: e.message };
  }
};

export default executeRequest;
