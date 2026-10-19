// Tema claro e escuro.
//
// Esse arquivo é carregado no <head>, antes do corpo da página aparecer.
// Se ele viesse no fim, quem escolheu o tema claro veria a tela escura
// piscar por um instante antes de clarear.
//
// O escuro é o padrão do IndieSquad: quem nunca escolheu nada abre no escuro.

(function () {
    const CHAVE = "tema";

    function temaGuardado() {
        try {
            return localStorage.getItem(CHAVE);
        } catch (erro) {
            // Navegação privada pode bloquear o localStorage. Nesse caso a
            // pessoa usa o tema padrão e nada quebra.
            return null;
        }
    }

    function aplicar(tema) {
        document.documentElement.dataset.tema = tema;

        // A cor da barra de status do celular tem que acompanhar o tema,
        // senão fica uma faixa branca em cima do app escuro.
        const cor = tema === "claro" ? "#f4f7f9" : "#0b0f14";
        document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
            meta.setAttribute("content", cor);
        });
    }

    aplicar(temaGuardado() || "escuro");

    // Fica no window porque o botão no HTML chama onclick="trocarTema()".
    window.trocarTema = function () {
        const novo = document.documentElement.dataset.tema === "claro" ? "escuro" : "claro";

        aplicar(novo);

        try {
            localStorage.setItem(CHAVE, novo);
        } catch (erro) {
            // Sem onde guardar, a troca vale só nessa visita.
        }
    };
})();
