// icones de traco das telas

const ICONES = {
    grafico: `<polyline points="3 17 9 11 13 15 21 6" fill="none" stroke="currentColor" stroke-width="2"/>`,
    pasta: `<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="2"/>`,
    estrela: `<path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6L3.3 9.4l6-.9z" fill="currentColor"/>`,
    pessoas: `<circle cx="9" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 5.5a3 3 0 0 1 0 5.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M17.5 14.5a5 5 0 0 1 3 5.5" fill="none" stroke="currentColor" stroke-width="2"/>`,
    relogio: `<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="12 7 12 12 16 14" fill="none" stroke="currentColor" stroke-width="2"/>`,
    confere: `<polyline points="4 12.5 9.5 18 20 6.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"/>`,
};


// devolve o svg montado: o viewBox e sempre 24 pra todos alinharem na mesma grade
function icone(nome, tamanho = 16) {
    if (!ICONES[nome]) return "";

    return `<svg viewBox="0 0 24 24" width="${tamanho}" height="${tamanho}" aria-hidden="true" focusable="false">${ICONES[nome]}</svg>`;
}
