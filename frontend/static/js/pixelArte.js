// pixel art da IndieSquad: tudo que e desenhado quadradinho por quadradinho
//
//   <is-sprite semente="laura" classe="arte"></is-sprite>   bonequinho da pessoa, sempre o mesmo pro mesmo apelido
//   <is-cartucho nome="Hollow Signal"></is-cartucho>         a capa do projeto, com a inicial em fonte de pixel
//   <is-numero>42</is-numero>                                numero em fonte de pixel que acende bloco por bloco
//   <is-medidor valor="60" segmentos="10"></is-medidor>      barra em segmentos, tipo barra de vida
//   <is-nivel valor="3"></is-nivel>                          nivel da funcao, de 1 a 4
//
// O texto de dentro do <is-numero> e o valor: quando o JS da tela faz
// escrever("total", 12), o numero se redesenha sozinho. As cores vem do CSS
// (currentColor e as variaveis --is-*), entao seguem o tema claro e o escuro.

const SVG = "http://www.w3.org/2000/svg";

const semMovimento = () => matchMedia("(prefers-reduced-motion: reduce)").matches;


// ---------- sorteio que sempre da o mesmo resultado pra mesma palavra ----------

function hash(texto) {
    let h = 2166136261;

    for (const letra of String(texto)) {
        h ^= letra.codePointAt(0);
        h = Math.imul(h, 16777619);
    }

    return h >>> 0;
}

function sorteador(semente) {
    let a = hash(semente) || 1;

    return function () {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}


// ---------- fonte de pixel 5x7 ----------

const FONTE = {
    "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
    "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
    "2": ["01110", "10001", "00001", "00110", "01000", "10000", "11111"],
    "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
    "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
    "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
    "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
    "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
    "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
    "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
    "%": ["11001", "11010", "00010", "00100", "01000", "01011", "10011"],
    ",": ["00", "00", "00", "00", "11", "01", "10"],
    ".": ["00", "00", "00", "00", "00", "11", "11"],
    "-": ["00000", "00000", "00000", "01110", "00000", "00000", "00000"],
    "—": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
    "/": ["00001", "00010", "00010", "00100", "01000", "01000", "10000"],
    "?": ["01110", "10001", "00001", "00110", "00100", "00000", "00100"],
    "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    "B": ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
    "C": ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
    "D": ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
    "E": ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    "F": ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
    "G": ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
    "H": ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
    "I": ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
    "J": ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
    "K": ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
    "L": ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    "M": ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
    "N": ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
    "O": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    "P": ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
    "Q": ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
    "R": ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    "T": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    "U": ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
    "V": ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
    "W": ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
    "X": ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
    "Y": ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
    "Z": ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
};

// letra com acento vira a mesma letra sem acento: Í → I, Ç → C
function semAcento(letra) {
    return letra.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
}

function glifo(letra) {
    return FONTE[letra] || FONTE[semAcento(letra)] || null;
}


// monta um <svg> a partir de uma lista de quadradinhos [coluna, linha]
function desenhar(colunas, linhas, quadrados, extra = "") {
    const svg = document.createElementNS(SVG, "svg");

    svg.setAttribute("viewBox", `0 0 ${colunas} ${linhas}`);
    svg.setAttribute("shape-rendering", "crispEdges");
    svg.setAttribute("aria-hidden", "true");

    let html = extra;

    for (const [x, y, classe] of quadrados) {
        html += `<rect x="${x}" y="${y}" width="1" height="1"${classe ? ` class="${classe}"` : ""}/>`;
    }

    svg.innerHTML = html;
    return svg;
}


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

        for (let x = 0; x < 4; x++) {
            // a coluna do meio e o tronco: nunca fica vazia no corpo
            const meio = x === 3 && y >= 1 && y <= 4;
            const borda = x === 0 && (y === 0 || y === 6);
            linha.push(meio || (!borda && sorte() < chance[y]));
        }

        grade.push(linha);
    }

    // os olhos: buraco na coluna 2 (e no espelho), com corpo em volta
    const olho = 2 + Math.floor(sorte() * 2);
    grade[olho][2] = false;
    grade[olho][1] = true;
    grade[olho - 1][2] = true;
    grade[olho + 1][2] = true;

    // espelha: colunas 0 1 2 3 2 1 0
    const quadrados = [];

    for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
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

        this.replaceChildren(desenhar(9, 9, montarSprite(semente).map(([x, y]) => [x + 1, y + 1])));
    }
}


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
        this.dataset.tom = hash(nome) % 5;

        const fenda = `<rect class="fenda" x="2" y="0" width="5" height="1"/>`;
        this.replaceChildren(desenhar(9, 11, quadrados, fenda));
    }
}


// ---------- numero em fonte de pixel ----------

class Numero extends HTMLElement {
    connectedCallback() {
        if (this.observador) return;

        this.raiz = this.attachShadow({ mode: "open" });
        this.raiz.innerHTML = `
            <style>
                :host { display: inline-block; line-height: 0; vertical-align: baseline; }
                svg { height: var(--is-numero-altura, 28px); width: auto; display: block; overflow: visible; fill: currentColor; }
                rect { animation: acender 260ms steps(2, end) both; animation-delay: var(--atraso); }
                @keyframes acender { from { opacity: 0; } to { opacity: 1; } }
                @media (prefers-reduced-motion: reduce) { rect { animation: none; } }
            </style>`;

        // o texto de dentro e o valor: o JS da tela so escreve nele
        this.observador = new MutationObserver(() => this.mudou());
        this.observador.observe(this, { childList: true, characterData: true, subtree: true });

        this.mudou();
    }

    mudou() {
        const texto = this.textContent.trim();

        if (texto === this.ultimo) return;
        this.ultimo = texto;
        this.setAttribute("aria-label", texto);
        this.setAttribute("role", "img");

        const alvo = Number(texto.replace(/[^\d]/g, ""));
        const sufixo = texto.replace(/^[\d.,]+/, "");

        // numero inteiro sobe contando, como placar de fliperama ("01" fica como esta)
        if (/^[1-9]\d*%?$/.test(texto) && !semMovimento() && this.isConnected) {
            this.contar(alvo, sufixo);
        } else {
            this.pintar(texto, true);
        }
    }

    contar(alvo, sufixo) {
        cancelAnimationFrame(this.quadro);

        const inicio = performance.now();
        const duracao = Math.min(900, 260 + alvo * 18);

        const passo = (agora) => {
            const t = Math.min(1, (agora - inicio) / duracao);
            const atual = Math.round(alvo * (1 - Math.pow(1 - t, 3)));

            this.pintar(`${atual}${sufixo}`, t === 1);

            if (t < 1) this.quadro = requestAnimationFrame(passo);
        };

        this.quadro = requestAnimationFrame(passo);
    }

    pintar(texto, final) {
        const quadrados = [];
        let x = 0;

        for (const letra of texto) {
            if (letra === " ") {
                x += 3;
                continue;
            }

            const linhas = glifo(letra);
            if (!linhas) continue;

            linhas.forEach((linha, y) => {
                [...linha].forEach((bit, coluna) => {
                    if (bit === "1") quadrados.push([x + coluna, y]);
                });
            });

            // cada letra ocupa a largura do desenho dela, mais uma coluna de espaco
            x += linhas[0].length + 1;
        }

        const largura = Math.max(1, x - 1);
        const svg = desenhar(largura, 7, quadrados);

        // so a pintura final acende em onda; a contagem troca seca
        if (final) {
            svg.querySelectorAll("rect").forEach((rect) => {
                const atraso = (Number(rect.getAttribute("x")) * 9 + Number(rect.getAttribute("y")) * 14) % 180;
                rect.style.setProperty("--atraso", `${atraso}ms`);
            });
        } else {
            svg.querySelectorAll("rect").forEach((rect) => (rect.style.animation = "none"));
        }

        const anterior = this.raiz.querySelector("svg");
        anterior ? anterior.replaceWith(svg) : this.raiz.append(svg);
    }
}


// ---------- medidor em segmentos ----------

class Medidor extends HTMLElement {
    static observedAttributes = ["valor", "max", "segmentos"];

    connectedCallback() {
        this.desenhar();
    }

    attributeChangedCallback() {
        if (this.isConnected) this.desenhar();
    }

    desenhar() {
        const max = Number(this.getAttribute("max") || 100);
        const valor = Math.max(0, Math.min(max, Number(this.getAttribute("valor") || 0)));
        const total = Number(this.getAttribute("segmentos") || 10);
        const cheios = Math.round((valor / max) * total);

        this.setAttribute("role", "meter");
        this.setAttribute("aria-valuenow", valor);
        this.setAttribute("aria-valuemin", 0);
        this.setAttribute("aria-valuemax", max);

        let html = "";

        for (let i = 0; i < total; i++) {
            html += `<i class="${i < cheios ? "cheio" : ""}" style="--i:${i}"></i>`;
        }

        this.innerHTML = html;
    }
}


// ---------- nivel da funcao: quatro casas ----------

class Nivel extends HTMLElement {
    static observedAttributes = ["valor"];

    connectedCallback() {
        this.desenhar();
    }

    attributeChangedCallback() {
        if (this.isConnected) this.desenhar();
    }

    desenhar() {
        const valor = Number(this.getAttribute("valor") || 0);

        this.setAttribute("role", "img");
        this.setAttribute("aria-label", `nível ${valor} de 4`);
        this.innerHTML = [1, 2, 3, 4].map((n) => `<i class="${n <= valor ? "cheio" : ""}"></i>`).join("");
    }
}


// ---------- a marca: um S de cinco blocos ----------
//
// Cinco blocos, um por classe (arte, audio, design, producao, programacao),
// montando um S de squad, no formato de uma peca de tetris de cinco.

const MARCA = [
    [1, 0, "arte"],
    [2, 0, "audio"],
    [1, 1, "design"],
    [0, 2, "programacao"],
    [1, 2, "producao"],
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
customElements.define("is-sprite", Sprite);
customElements.define("is-cartucho", Cartucho);
customElements.define("is-numero", Numero);
customElements.define("is-medidor", Medidor);
customElements.define("is-nivel", Nivel);

export { montarSprite, hash };
