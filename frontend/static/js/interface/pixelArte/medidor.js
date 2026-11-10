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
        // regra de tres pra saber quantos segmentos ficam acesos tipo 60 de 100 com 10 segmentos da 6
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


customElements.define("is-medidor", Medidor);
