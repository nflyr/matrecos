/*----------------------------------+
 | IDP BROKER - ITERAÇÃO DE UPLOAD  |
 +---------------------------------*/

//
// Funções isoladas num objeto global chamado idpProxy
//
(function () {
  /*----------------------+
  | ESTÁTICOS/CONTADORES  |
  +----------------------*/

  let PDVFile_ID = 0; //Simula contador de ficheiro.
  const IDP_TYPECODE = "SCPTLoanRequest";
  const STS_CLIENT_ID = "b07d3c31-1a5f-4f80-af4b-9a1cff8c0622";
  const STS_CLIENT_SECRET = "qE=N{w6<agk.dds1l*DjOP.TA@usLI";
  const URL_STS_HOST = "https://apis-auth-cgs.sva.cloud.scf.dev.corp";
  const IDP_SANTANDER_CLIENT_ID = "Gmi8mp6QQpqeAlrX1IY7eTjfEEfx1N3q";
  const URL_IDP_HOST = "https://cgs-internet-client.sva.cloud.scf.dev.corp";
  const URL_REVERSE_PROXY = "https://docmgmt-internet.idpbkr.sva.cloud.scf.dev.corp";

  /*-------------+
  | UTILITÁRIOS  |
  +-------------*/

  /**
   * Log to (html) and console
   * @param {*} data The data to display in the log
   * @param {*} error (optional) to pass an error object
   * @returns void
   */
  let pageLog = document.querySelector("#console");
  const log = function () {
    const now = new Date().toISOString();
    const args = Array.from(arguments);
    if (pageLog) {
      let data = "";
      args.forEach((arg) => {
        data = data + `<span class="log">${typeof arg === "object" ? JSON.stringify(arg) : arg}</span>`;
      });
      const p = document.createElement("p");
      p.innerHTML = `<span class="timestamp">${now}</span>${data}`;
      pageLog.appendChild(p);
      pageLog.scrollTop = console.scrollHeight;
    }
    console.log(now, args);
  };

  /**
   * Empty the page logger.
   * @returns void
   */
  const clearLog = () => {
    if (pageLog) {
      while (pageLog.firstChild) {
        pageLog.removeChild(pageLog.lastChild);
      }
    }
  };

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

  /*----------------------------------------------+
  | COISAS QUE SÃO PARA EXECUTAR EM SERVIDOR (OS) |
  +----------------------------------------------*/

  /**
   * Serviço - IDP : STS - Ober um token para acesso via Internet
   * Nota: NA REALIDADE ISTO SERÁ FEITO EM SERVER
   * @returns O token de autenticação STS (ou false se falhar)
   */
  const serviceStsInet = async () => {
    log("is1: serviceStsInet() - Obtendo token STS via Internet");
    const url = `${URL_STS_HOST}/sts/tokens/jwt/generic`;
    const headers = new Headers();
    headers.append("Accept", "*/*");
    headers.append("Content-Length", 0);
    headers.append("Authorization", `Basic ${btoa(STS_CLIENT_ID + ":" + STS_CLIENT_SECRET)}`);
    const options = {
      responseType: "json",
      method: "POST",
      headers: headers,
      redirect: "follow",
    };
    return await remote(url, options);
  };

  /**
   * Serviço - IDP : oAuth para obter um token de acesso para serviços IDP
   * Nota: NA REALIDADE ISTO SERÁ FEITO EM SERVER
   * @param {*} auth Token de autenticação STS.
   * @returns O Access token de autenticação oAuth (ou false se falhar)
   */
  const serviceoAuthInet = async (auth) => {
    log("is2: serviceoAuthInet() - Obtendo token oAuth via Internet");
    const url = `${URL_IDP_HOST}/authentication/oauth/token`;
    const headers = new Headers();
    headers.append("Accept", "*/*");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    const body = new URLSearchParams(); // FormData();
    body.append("scope", "document");
    body.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
    body.append("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer");
    body.append("assertion", auth);
    body.append("client_assertion", auth);
    const options = {
      responseType: "json",
      method: "POST",
      headers: headers,
      body: body,
      redirect: "follow",
    };
    return await remote(url, options);
  };

  /**
   * Serviço - IDP : Criar metadados e reservar S3 para novo documento
   * Nota: NA REALIDADE ISTO SERÁ FEITO EM SERVER
   * @param {*} auth token de autenticação oAuth (IDP)
   * @returns Os dados de acesso ao bucket S3 para upload do documento.
   */
  const serviceDocManPost = async (auth, data) => {
    log("is3: serviceDocManPost() - Pedindo upload de documento via Internet");
    const url = `${URL_IDP_HOST}/v2/document_management/upload_document`;
    const headers = new Headers();
    headers.append("Accept", "*/*");
    headers.append("Content-Type", "application/json");
    headers.append("x-santander-client-id", IDP_SANTANDER_CLIENT_ID);
    headers.append("Authorization", `Bearer ${auth}`);
    const options = {
      responseType: "json",
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
      redirect: "follow",
    };
    return await remote(url, options, ["Authorization"]);
  };

  /**
   * Serviço - IDP : Enviar ficheiro (bytes) para o bucket S3
   * Nota: Este método deve ser chamado directamente do BROWSER.
   * @param {*} auth Token de autenticação auxiliar (obtido do pedido de upload).
   * @param {*} putHref Href seguro com destino do ficheiro (obtido do pedido de upload).
   * @param {*} mimeType Tipo/formato do conteúdo enviado (do ficheiro enviado).
   * @param {*} file O ficheiro (objeto "file") a enviar.
   * @returns void
   */
  const serviceDocManPutFile = async (auth, putHref, mimeType, file) => {
    log("is4: serviceDocManPutFile() - Enviar ficheiro (bytes) para o bucket S3.");
    const url = `${URL_REVERSE_PROXY}/file/upload`;
    const headers = new Headers();
    headers.append("Accept", "*/*");
    headers.append("Content-Type", mimeType);
    headers.append("Authorization", auth); // Bearer token
    headers.append("x-redirect-uri", putHref); // URL de redireção para o S3
    const options = {
      responseType: "void",
      method: "PUT",
      headers: headers,
      body: file,
      redirect: "follow",
    };
    return await remote(url, options);
  };

  /**
   * Serviço - IDP : Request Document Processing
   * Nota: NA REALIDADE ISTO SERÁ FEITO EM SERVER
   * @param {*} auth Token de autenticação oAuth (IDP).
   * @returns O ID de processamento do documento no IDP Broker (ou erro).
   */
  const serviceIDPExtract = async (auth, data) => {
    log("is5: serviceIDPExtract() - Solicitar processamento de documento via Internet");
    const url = `${URL_IDP_HOST}/v1/intelligent_document_processing/extract_file_information`;
    const headers = new Headers();
    headers.append("Accept", "*/*");
    headers.append("Content-Type", "application/json");
    headers.append("x-santander-client-id", IDP_SANTANDER_CLIENT_ID);
    headers.append("Authorization", `Bearer ${auth}`);
    const options = {
      method: "POST",
      headers: headers,
      body: typeof data === "string" ? data : JSON.stringify(data),
      redirect: "follow",
    };
    return await remote(url, options);
  };

  /*--------------------------------------------------------------+
  | THIS SIMULATES A COMBO API/SERVICE ACTION EXPOSED ON INTRANET |
  +--------------------------------------------------------------*/

  /**
   * Pipeline - Processo de pedido de upload para IDP
   * Nota: NA REALIDADE ISTO SERÁ FEITO EM SERVER (via API)
   * @param {*} docMetadata objeto com metadados do documento: name, mimeType e typeCode
   * @param {*} checklist Array com os tipos de documento que o cliente quer enviar
   * @returns Objeto com os dados para carregamento do documento:
   */
  const apiLoadFileToFileBroker = async (docMetadata) => {
    log("api1: apiProcessDocumentForIDP() - Iniciando processo de upload para IDP");

    //
    // NOTA: É necessário gerar um "nome" de documento único, porque a API do Docman não garante isso.
    //       Assim, este código simula a geração de um nome único para o documento, com base na chave do PDVFile (equivalente).
    //
    docMetadata.fileName = docMetadata.name; //preserva nome original
    docMetadata.name = `File_${PDVFile_ID++}_${docMetadata.name}`;

    //
    // 1. Obter o token STS para autenticação via Internet.
    //

    const stsResponse = await serviceStsInet();
    if (stsResponse.error) {
      log("api1: Falhou otenção do token STS (is1)", stsResponse);
      return stsResponse;
    }
    const stsToken = stsResponse.data.token;

    //
    // 2. Pedir o token oAuth
    //

    const authResponse = await serviceoAuthInet(stsToken);
    if (authResponse.error) {
      log("api1: Falhou otenção do token oAuth (is2)", authResponse);
      return authResponse;
    }
    const authToken = authResponse.data.access_token;

    //
    // 3. Invocar o serviço de upload de documento
    //    Preenche com valoers defeito os parâmetros que por enquanto não
    //    temos noção para que servem, ou se podem ser omitidos.
    //

    const docmanResponse = await serviceDocManPost(authToken, {
      document: docMetadata,
      callerInformation: {
        appId: "auto",
        name: "dealer portal contracting",
      },
    });
    if (docmanResponse.error) {
      log("api1: Falhou pedido de upload documento (is3)", docmanResponse);
      return docmanResponse;
    }

    //
    // Return the data required for the customer to actually upload the document
    //

    return { idpAuth: authToken, docAuth: docmanResponse.headers.Authorization, data: docmanResponse.data };
  };

  /*---------------------------------------------------+
  | COISAS QUE SÃO PARA EXECUTAR NO BROWSER DO CLIENTE |
  +---------------------------------------------------*/

  /**
   * Código a executar quando o cliente pressiona o botão de upload.
   * - Chama a API para obter os metadados do upload
   * - Invoca o serviço para carregar efetivamento o documento
   * - Executa a server-action que guarda o documento e checklist modelo legacy
   */
  const formUpload = document.querySelector("form[data-js-Hook='uploadForm']");
  const HandleUploadButton = function (event) {
    event.preventDefault();
    clearLog();
    if (!formUpload) {
      log("PROBLEMA -> Formulário de upload não encontrado.");
      return;
    }
    log("UI: Cliente pressionou o botão de upload.");

    //
    // Aqui, recolhe os dados do formulário.
    //

    const fileInput = formUpload.querySelector("input[data-js-Hook='input:file']");
    if (fileInput.files.length == 0) {
      log("Erro funcional", "O utilizador não indicou qualquer ficheiro para upload");
      return;
    }
    const fileToUpload = fileInput.files[0];
    const docMetadata = {
      name: fileToUpload.name,
      mimeType: fileToUpload.type,
      typeCode: IDP_TYPECODE,
    };
    log("Ficheiro a carregar:", docMetadata);

    //
    // Aqui, simula a chamada à API (OS) de obtenção dos metadados do upload (ha-de ser uma API).
    //

    apiLoadFileToFileBroker(docMetadata)
      .then((apiResponse) => {
        log(`UI: apiUploadFileBrokerItem devolveu:`, apiResponse.data.document.documentId);

        //
        // UPLOAD DO FICHEIRO no S3
        // Vai efetivamente executar a server action de upload (LEGACY, so to speak).
        // Coloca-se aqui os parâmetros que devem ser enviados para OS.
        //

        log("UI: Enviar o ficheiro para o S3.");
        serviceDocManPutFile(
          apiResponse.docAuth,
          apiResponse.data.accessInformation.href,
          docMetadata.mimeType,
          fileToUpload
        ).then((uploadResponse) => {
          if (uploadResponse.error) {
            log("UI: Erro ao enviar o ficheiro para o S3", uploadResponse);
            return;
          }
          log("UI: Ficheiro carregado com sucesso no S3", uploadResponse ?? "");

          //
          // SUBMETER PROCESSAMENTO DO FICHEIRO VIA OCR
          // Vai chamar o serviço de extract_data_information a partir do ficheiro carregado.
          // O output será um ID de processo, sob o qual virá a resposta remota.
          //

          const idpExtData = {
            file_information: {
              externalProperties: [],
              language: {
                code: "pt-PT",
              },
              loadingIndicator: false,
              manualValidationIndicator: false,
              mimeType: docMetadata.mimeType,
              typeCode: IDP_TYPECODE,
              uri: apiResponse.data.document.documentId,
            },
            process_information: {
              processId: "SCFLoanRequest",
            },
            callback_url: {
              href: "https://outsystemspt.sceu.dev.corp/IDPBroker_API/ocrData/346657",
            },
          };

          log("UI: Solicitar processamento OCR sobre o ficheiro.");
          serviceIDPExtract(apiResponse.idpAuth, idpExtData).then((idpExtrResponse) => {
            if (idpExtrResponse.error) {
              log("UI: Erro ao solicitar processamento do OCR", idpExtrResponse);
              return;
            }
            log("UI: Processamento OCR do ficheiro aceite:", idpExtrResponse ?? "");

            //
            // Atualiza os resultados na UI
            //

            const results = document.querySelector("#results");
            if (results) {
              results.innerHTML =
                `<p>File Name: ${docMetadata.name}</p>` +
                `<p>Mime Type: ${docMetadata.mimeType}</p>` +
                `<p>Document ID: ${apiResponse.data.document.documentId}</p>` +
                `<p>IDP Process ID: ${idpExtrResponse.data}</p>`;
            }
          });
        });
      })
      .catch((e) => {
        log("Cancelada execução de upload IDP", e);
      });
  };

  //
  // Adiciona o evento de clique ao botão de upload
  //
  const uploadButton = document.querySelector("button[data-js-Hook='uploadButton']");
  if (uploadButton) {
    uploadButton.addEventListener("click", HandleUploadButton);
  } else {
    log("PROBLEMA -> Botão de upload não encontrado.");
  }
})();
