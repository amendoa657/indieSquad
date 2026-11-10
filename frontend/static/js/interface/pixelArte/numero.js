import { semMovimento, desenhar } from "./desenho.js";
import { glifo } from "./fonte.js";


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
        // o mutationobserver fica vigiando o texto de dentro e quando alguem troca o numero ele chama o mudou sozinho
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

        // separa o numero do resto tipo 65% vira alvo 65 e sufixo %
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
        // numero maior conta mais devagar mas nunca passa de 900 ms
        const duracao = Math.min(900, 260 + alvo * 18);

        const passo = (agora) => {
            const t = Math.min(1, (agora - inicio) / duracao);
            // o t vai de 0 a 1 no tempo e essa conta faz a contagem comecar rapido e frear no final
            const atual = Math.round(alvo * (1 - Math.pow(1 - t, 3)));

            this.pintar(`${atual}${sufixo}`, t === 1);

            // enquanto nao chegou no fim pede pro navegador chamar de novo no proximo quadro da tela
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
                // cada pixel ganha um atraso pela posicao dele entao eles acendem em onda e nao todos juntos
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


customElements.define("is-numero", Numero);
