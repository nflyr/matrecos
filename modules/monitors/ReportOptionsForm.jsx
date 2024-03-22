import { vjsx } from "../core/jsx-runtime";
/** @jsx vjsx */

import vjs from "../core/js-vanilla";

import { monserver } from "./request-proxy";

/*
Component: contracting
File     : ReportOptionsForm.jsx
Author   : n71013
Licence  : MIT
Versions : 
   2023.07.10 (v1) - Initial version
   aaaa.mm.dd (v?) - Description...

Request the user to enter there required information necessary to request
a specific report from the server. Find the fields bellow. 

Then, on "OK" the form will return the arguments collected from the user.

This form is *** WIP ** (maybe a generic template)

*/

/**
 * draw header navigator
 */
export function ReportOptionsForm() {
  //
  //report options

  const reports = {
    r1: { name: "Validação Documental - Por Verificar", url: `${monserver}/cq/dv/pending/report` },
    r2: { name: "Validação Documental - Histórico", url: `${monserver}/cq/dv/history/report`, required: ["fromDate"] },
    r3: { name: "Ciclo de Vida Contratação - Time to Yes", url: `${monserver}/clc/proposal/report`, required: ["fromDate"] },
    r4: { name: "Ciclo de Vida Contratação - Time to Pay", url: `${monserver}/clc/contract/report`, required: ["fromDate"] },
    r5: { name: "Proponentes - Identificação e Dados", url: `${monserver}/clc/proponent/report`, required: ["fromDate"] },
    r6: { name: "Renting BSP - Histórico", url: `${monserver}/rbsp/history/report`, required: ["fromDate"] },
  };

  //calculate helper dates
  const today = vjs.formatDate(new Date(), true);

  // execute the reportx\
  const execReport = (e) => {
    const ef = e.target;
    const data = new FormData(ef);
    const args = {};
    for (const arg of data.entries()) {
      args[arg[0]] = arg[1];
    }
    const report = reports[args.reportType];
    (report.required ?? []).forEach((item) => {
      if (args[item] == "") {
        alert("Obrigatório prencher o campo " + item);
        e.preventDefault();
        return false;
      }
    });
    //form will be submitted by default if not cancelled on validation
    ef.action = report.url;
  };

  return (
    <form id="ReportOptionsForm" method="GET" action="" target="_blank" class="config-form" onSubmit={execReport}>
      <div class="form-data">
        <div class="form-data-item">
          <h2>Tipo de Relatório</h2>
          {Object.entries(reports).map(([key, r]) => (
            <div>
              <input name="reportType" type="radio" value={key} id={`reportTypeId${key}`} required />
              <label for={`reportTypeId${key}`}>{r.name}</label>
            </div>
          ))}
        </div>
        <div class="form-data-item">
          <label for="fromDateId">Data de Início (fromDate)</label>
          <input name="fromDate" id="fromDateId" type="date" placeholder="Data de início" min="2022-01-01" />
        </div>
        <div class="form-data-item">
          <label for="toDateId">Data de fim (toDate)</label>
          <input name="toDate" id="toDateId" type="date" placeholder="Data de fim" value={today} />
        </div>
      </div>
      <button type="submit">Executar</button>
    </form>
  );
}

export default ReportOptionsForm;
