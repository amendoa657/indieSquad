import { hash } from "../../perfil/fotoPerfil/hash.js";
import { desenhar } from "../../interface/pixelArte/desenho.js";
import { FONTE, glifo } from "../../interface/pixelArte/fonte.js";


// ---------- cartucho: a capa do projeto ----------

class Cartucho extends HTMLElement {
    static observedAttributes = ["nome"];

    connectedCallback() {
        this.desenhar();
    }

    attributeChangedCallback() {
        if (this.isConnected) this.desenhar();
    }

    desenhar() {
        const nome = (this.getAttribute("nome") || "?").trim();
        const linhas = glifo(nome.charAt(0)) || FONTE["?"];
        const quadrados = [];

        // a letra fica no meio de uma grade 9x11, com a fenda do cartucho em cima
        linhas.forEach((linha, y) => {
            [...linha].forEach((bit, x) => {
                if (bit === "1") quadrados.push([x + 2, y + 3]);
            });
        });

        // o tom sai do nome: o mesmo projeto tem sempre a mesma cor
        // o % 5 pega o resto da divisao entao sempre da um numero de 0 a 4 que e uma das 5 cores
        this.dataset.tom = hash(nome) % 5;

        const fenda = `<rect class="fenda" x="2" y="0" width="5" height="1"/>`;
        this.replaceChildren(desenhar(9, 11, quadrados, fenda));
    }
}


customElements.define("is-cartucho", Cartucho);
