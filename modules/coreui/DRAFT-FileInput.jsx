/*
 PARA INTEGRAÇÃO: UM FILE-INPUT FORMATADO PARA CARREGAR FICHEIRO(S) EM STAND-ALONE

 (necessita de integração em modelo Widget)
 (necessita de normalização do CSS)

 */

/**
 * Render A SINGLE File Input component.
 * @returns DOM node
 */
renderPage.singleFileInput = () => {
  return (
    <div className="ocrid-container ocrid-scan" data-ocrid-tag="ocrid-scan-file-box">
      <div className="ocrid-scan-file" data-ocrid-tag="ocrid-scan-file">
        <h2 className="ocrid ocrid-subtitle ocrid-opacity_low">Ficheiros</h2>
        <div className="ocrid-button-bar">
          <div className="ocrid-card">
            <header className="ocrid-card__header">
              <p className="ocrid-title">Adicionar Cartão de Cidadão</p>
            </header>
            <main>
              <p className="ocrid-subtitle ocrid-text-pretty">Carregue ficheiros JPG/JPEG, PNG ou PDF até 10MB</p>
              <div className="ocrid-field-wrapper" data-ocrid-tag="ocrid-file-01-wrapper">
                <label for="ocrid-file-01" className="ocrid-field-content">
                  <div className="ocrid-field-infix">
                    <input
                      type="file"
                      id="ocrid-file-01"
                      data-uibase-role="field-value"
                      data-ocrid-tag="ocrid-file-01"
                      accept="image/png, image/jpeg, application/pdf"
                      placeholder="Carregue aqui o Cartão de Cidadão"
                      multiple="multiple"
                      style="display:none"
                    ></input>
                    <ul data-uibase-role="infix-label" data-ocrid-tag="ocrid-file-01"></ul>
                  </div>
                  <div className="ocrid-field-sufix">
                    <img class="ocrid-field-sufix__icon" src="/img/icon_upload.svg"></img>
                  </div>
                </label>
                <footer className="ocrid-field-subscript">
                  <span>ADICIONAR FICHEIRO(S)</span>
                </footer>
              </div>
            </main>
          </div>
        </div>
        <div className="ocrid-button-bar">
          <button className="ocrid-button" data-ocrid-tag="ocrid-button-scan-file-restart">
            Voltar
          </button>
          <button className="ocrid-button ocrid-button-default" data-ocrid-tag="ocrid-button-scan-file">
            Avançar
          </button>
        </div>
        <h2 data-ocrid-tag="ocrid-label-file-wait">Em processamento...</h2>
      </div>
    </div>
  );
};

/**
 * Role: Widget/Input::File
 * Adds behaviour to a SINGLE INPUT:FILE
 * @param {*} fieldElem - The ROOT element of the component do handle
 */
const singleFileInputBind = (fieldElem) => {
  const valueElem = vjs.qry("input[data-uibase-role='field-value']", fieldElem);
  const wrapperLabel = vjs.qry("h3[data-uibase-role='wrapper-label']", fieldElem);
  const infixLabel = vjs.qry("span[data-uibase-role='infix-label']", fieldElem);
  const placeholder = valueElem.getAttribute("placeholder");
  vjs.replace(infixLabel, placeholder);
  vjs.replace(wrapperLabel, placeholder);
  valueElem.addEventListener(
    "change",
    (e) => {
      e.preventDefault();
      if (valueElem.files.length > 0) {
        vjs.replace(infixLabel, valueElem.files[0].name);
        vjs.removeClass(wrapperLabel, "ocrid-hidden");
      } else {
        vjs.replace(infixLabel, placeholder);
        vjs.addClass(wrapperLabel, "ocrid-hidden");
      }
      return false;
    },
    false
  );
};

/**
 * Render A MULTIPLE File Input component.
 * @returns DOM node
 */
const multipleFileInput = (relId, placeholder, description) => {
  const fieldTag = `ocrid-file-${relId}`;
  const wrapperTag = `${fieldTag}-wrapper`;
  const labelTag = `${fieldTag}-label`;
  return (
    <div className="ocrid-card">
      <header className="ocrid-card__header">
        <p className="ocrid-title">{placeholder}</p>
      </header>
      <main>
        <p className="ocrid-subtitle ocrid-min-height ocrid-text-pretty">{description}</p>
        <div className="ocrid-field-wrapper" data-ocrid-tag={wrapperTag}>
          <label for={fieldTag} className="ocrid-field-content">
            <div className="ocrid-field-infix">
              <input
                type="file"
                id={fieldTag}
                data-uibase-role="field-value"
                data-ocrid-tag={fieldTag}
                accept="image/png, image/jpeg, application/pdf"
                placeholder={placeholder}
                style="display:none"
              ></input>
              <span data-uibase-role="infix-label" data-ocrid-tag={labelTag}></span>
            </div>
            <div className="ocrid-field-sufix">
              <img class="ocrid-field-sufix__icon" src="/img/icon_upload.svg"></img>
            </div>
          </label>
          <footer className="ocrid-field-subscript">
            <span>JPEG / JPG / PNG / PDF</span>
          </footer>
        </div>
      </main>
    </div>
  );
};

/**
 * Role: Widget/Input::File
 * Adds behaviour to a SINGLE INPUT:FILE
 * @param {*} fieldElem - The ROOT element of the component do handle
 */
renderPage.multipleFileInputBind = (fieldElem, handle) => {
  const valueElem = vjs.qry("input[data-uibase-role='field-value']", fieldElem);
  const infixLabel = vjs.qry("[data-uibase-role='infix-label']", fieldElem);
  const placeholder = valueElem.getAttribute("placeholder");
  vjs.replace(infixLabel, <li className="ocrid-list-flat">{placeholder}</li>);
  vjs.removeClass(infixLabel, "ocrid-field-infix--hasdata");
  valueElem.addEventListener(
    "change",
    (e) => {
      e.preventDefault();
      if (valueElem.files.length > 0) {
        const items = [];
        for (let i = 0; i < valueElem.files.length; i++) {
          let sb = valueElem.files[i].size,
            sz = 0;
          while (sb > 1024) {
            sb = sb / 1024;
            sz++;
          }
          sz = Math.ceil(sb) + [" bytes", "KB", "MB", "GB", "TB"][sz];
          items.push(
            <li className="ocrid-list-flat">
              {valueElem.files[i].name} ({sz})
            </li>
          );
        }
        vjs.replace(infixLabel, items);
        vjs.addClass(infixLabel, "ocrid-field-infix--hasdata");
      } else {
        vjs.replace(infixLabel, <li className="ocrid-list-flat">{placeholder}</li>);
        vjs.removeClass(infixLabel, "ocrid-field-infix--hasdata");
      }
      if (typeof handle === "function") handle.call(null, e);
      return false;
    },
    false
  );
};

/* FOR THE ABOVE COMPONENTS...

CSS -> Field Input Components 

.ocrid-field-wrapper {
  position: relative;
  width: 100%;
  display: inline-block;
}

.ocrid-field-wrapper-label {
  position: absolute;
  margin: 0;
  border: 0;
  padding: 0 0.5em;
  left: 0.6em;
  top: -0.6em;
  background-color: var(--clr-light);
  color: var(--clr-dark);
  font-size: var(--font-size-XS);
}

.ocrid-min-height {
  min-height: 8ch;
}

.ocrid-field-content {
  display: flex;
  justify-content: space-between;
  background-color: var(--clr-medium);
  border: 2px solid var(--clr-dark);
  border-radius: 0.3em;
  padding: 0.5rem;
  cursor: pointer;
}

.ocrid-field-infix {
  color: var(--clr-dark);
  padding: 0 0.5em;
  overflow: hidden;
  width: 100%;
}

.ocrid-field-infix--hasdata {
  color: var(--clr-santander);
}

.ocrid-field-sufix__icon {
  opacity: 0.3;
}

.ocrid-field-subscript {
  padding: 0.1rem;
  font-family: var(--font-subscript);
  font-size: var(--font-size-S);
  color: var(--clr-dark);
  text-align: right;
}  

*/
