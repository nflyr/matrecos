/*----------------------------------+
 | IDP BROKER - ITERAÇÃO DE UPLOAD  |
 +---------------------------------*/

//
// Funções isoladas num objeto global chamado idpProxy
//
(function () {
  /*-------------+
  | UTILITÁRIOS  |
  +-------------*/

  /**
   * Fetch data from remote server (uses Window.fetch)
   * @param {*} url - The service url to invoke.
   * @param {*} options - (optional) request parameters (fetch configuratio + body)
   * @param {*} headers - (optional) array de nomes de headers de resposta a devolver.
   * @returns A promise...
   */
  const remote = async function (url, options, headers) {
    options = options ?? {};
    const outputType = options.responseType ?? "json";
    delete options.responseType; //remove from options, not supported by fetch
    headers = headers ?? [];
    if (!Array.isArray(headers)) headers = [headers];
    const abortCtl = new AbortController();
    const abortId = setTimeout(() => abortCtl.abort("Timeout"), 30000);
    try {
      const response = await fetch(url, Object.assign(options, { signal: abortCtl.signal }));
      clearTimeout(abortId);
      if (response.type === "opaque") {
        const e = "Response Redacted (opaque) by CORS";
        log(`remote/fetch [${url}]`, e);
        return { error: e };
      }
      if (response.ok) {
        let payload = {};
        //try to fethch the response, in the requested data type (except void)
        payload.data = outputType === "void" ? null : await response[outputType]();
        //make sue to capture headers to return on the response.
        if (headers.length > 0) {
          payload.headers = {};
          for (const header of headers) {
            if (response.headers.has(header)) {
              payload.headers[header] = response.headers.get(header);
              log(`remote/response`, `Header ${header} found in response.`);
            } else {
              log(`remote/response`, `Header ${header} NOT FOUND.`);
            }
          }
        }
        //done
        return payload;
      } else {
        const errors = await response.json();
        return { error: response.status, cause: errors ?? response.statusText };
      }
    } catch (e) {
      clearTimeout(abortId);
      log(`remote/fetch [${url}]`, e.toString());
      return { error: e.toString() };
    }
  };

  /**
   * Serviço - IDP : Enviar ficheiro (bytes) para o bucket S3
   * Nota: Este método deve ser chamado directamente do BROWSER.
   * @param {*} authToken Token de autenticação auxiliar (obtido do pedido de upload).
   * @param {*} hrefToken Href seguro com destino do ficheiro (obtido do pedido de upload).
   * @param {*} mimeType Tipo/formato do conteúdo enviado (do ficheiro enviado).
   * @param {*} file O ficheiro (objeto "file") a enviar.
   * @returns void
   */
  const serviceDocManPutFile = async (reverseUrl, authToken, hrefToken, mimeType, file) => {
    const headers = new Headers();
    headers.append("Accept", "*/*");
    headers.append("Content-Type", mimeType);
    headers.append("Authorization", authToken); // Bearer token
    headers.append("x-redirect-uri", hrefToken); // URL de redireção para o S3
    const options = {
      responseType: "void",
      method: "PUT",
      headers: headers,
      body: file,
      redirect: "follow",
    };
    return await remote(reverseUrl, options);
  };

  //
  // Recebe indicação do Objeto "File" e faz o upload do ficheiro para o S3.
  //

  const processFileUpload = async (hookSelector, reverseUrl, authToken, hrefToken, mimeType) => {
    const fileInput = formUpload.querySelector(hookSelector);
    if (fileInput.files.length == 0) {
      return `Error, file to upload not found with selector [${hookSelector}]`;
    }

    return await serviceDocManPutFile(reverseUrl, authToken, hrefToken, mimeType, fileInput[0]);
  };

  //
  // Exportar para o objeto global o processador de Uplaod
  //

  window.idpUploadFileToS3 = processFileUpload;
})();
