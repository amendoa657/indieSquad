import { SVG } from "./desenho.js";


// ---------- a marca: a cruz de um controle, em cinco blocos ----------
//
// O direcional do controle, com um bloco por classe (arte, audio, design,
// producao, programacao): a equipe inteira forma o controle.

const MARCA = [
    [1, 0, "arte"],
    [0, 1, "producao"],
    [1, 1, "design"],
    [2, 1, "audio"],
    [1, 2, "programacao"],
];

class Marca extends HTMLElement {
    connectedCallback() {
        if (this.firstChild) return;

        const svg = document.createElementNS(SVG, "svg");

        svg.setAttribute("viewBox", "0 0 30 30");
        svg.setAttribute("aria-hidden", "true");
        svg.innerHTML = MARCA.map(([coluna, linha, classe]) =>
            `<rect class="bloco-${classe}" x="${coluna * 10.5}" y="${linha * 10.5}" width="9" height="9"/>`).join("");

        this.append(svg);
    }
}


customElements.define("is-marca", Marca);
