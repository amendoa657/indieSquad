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


customElements.define("is-nivel", Nivel);
