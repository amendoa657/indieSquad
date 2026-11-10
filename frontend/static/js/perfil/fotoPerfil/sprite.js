import { sorteador } from "./hash.js";
import { desenhar } from "../../interface/pixelArte/desenho.js";


// ---------- sprite: o bonequinho de cada pessoa ----------
//
// 7 colunas espelhadas no meio (so 4 sao sorteadas) e 7 linhas. O miolo e
// quase sempre cheio, os olhos sao sempre buracos, antena e pernas variam:
// sai um bichinho diferente pra cada apelido, e o mesmo apelido da sempre
// o mesmo bichinho.

function montarSprite(semente) {
    const sorte = sorteador(semente);
    const grade = [];

    // chance de cada linha ter quadradinho: antena rala, corpo cheio, pernas soltas
    const chance = [0.35, 0.7, 0.85, 0.9, 0.75, 0.5, 0.4];

    for (let y = 0; y < 7; y++) {
        const linha = [];

        // so sorteia 4 colunas porque as outras 3 sao o espelho dessas
        for (let x = 0; x < 4; x++) {
            // a coluna do meio e o tronco: nunca fica vazia no corpo
            const meio = x === 3 && y >= 1 && y <= 4;
            const borda = x === 0 && (y === 0 || y === 6);
            // se for tronco ja e cheio se for canto fica vazio e no resto joga o dado com a chance da linha
            linha.push(meio || (!borda && sorte() < chance[y]));
        }

        grade.push(linha);
    }

    // os olhos: buraco na coluna 2 (e no espelho), com corpo em volta
    // sorteia se o olho fica na linha 2 ou 3 e depois forca corpo em volta pro buraco parecer olho
    const olho = 2 + Math.floor(sorte() * 2);
    grade[olho][2] = false;
    grade[olho][1] = true;
    grade[olho - 1][2] = true;
    grade[olho + 1][2] = true;

    // espelha: colunas 0 1 2 3 2 1 0
    const quadrados = [];

    for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
            // da coluna 4 em diante pega a coluna do outro lado tipo 4 vira 2 e 6 vira 0
            const fonte = x <= 3 ? x : 6 - x;

            if (grade[y][fonte]) quadrados.push([x, y]);
        }
    }

    return quadrados;
}


class Sprite extends HTMLElement {
    static observedAttributes = ["semente"];

    connectedCallback() {
        this.desenhar();
    }

    attributeChangedCallback() {
        if (this.isConnected) this.desenhar();
    }

    desenhar() {
        const semente = this.getAttribute("semente") || "?";

        // o bichinho tem 7x7 mas o desenho e 9x9 entao soma 1 em tudo pra sobrar uma margem em volta
        this.replaceChildren(desenhar(9, 9, montarSprite(semente).map(([x, y]) => [x + 1, y + 1])));
    }
}


customElements.define("is-sprite", Sprite);

export { montarSprite };
