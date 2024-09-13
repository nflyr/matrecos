/*
Gestão do script que adiciona o GTM nas cabeçeiras de Outsystems

Em 28/08/2024, foi solicitado que mude de:

https://www.googletagmanager.com/gtm.js?id=GTM-M4RKRDN&gtm_auth=ge2ir8aJrikuSbkOyACW2g&gtm_preview=env-3&gtm_cookies_win=x

para

https://www.googletagmanager.com/gtm.js?id=GTM-M4RKRDN

*/

//
// PRE
//
(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != "dataLayer" ? "&l=" + l : "";
  j.async = true;
  j.src =
    "https://www.googletagmanager.com/gtm.js?id=" +
    i +
    dl;
    // removido 30/08/2024: + "&gtm_auth=4CPOr-3Y9B1zmN2BaNpN1Q&gtm_preview=env-237&gtm_cookies_win=x";
  f.parentNode.insertBefore(j, f);
})(window, document, "script", "dataLayer", "GTM-KBDZJMJ");

//
// PRO
//
(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != "dataLayer" ? "&l=" + l : "";
  j.async = true;
  j.src =
    "https://www.googletagmanager.com/gtm.js?id=" +
    i +
    dl;
    // removido 30/08/2024: + "&gtm_auth=WWospLTK-e9HhyA_4bcacw&gtm_preview=env-1&gtm_cookies_win=x";
  f.parentNode.insertBefore(j, f);
})(window, document, "script", "dataLayer", "GTM-M4RKRDN");
