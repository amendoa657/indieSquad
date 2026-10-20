// tema claro e escuro

(function () {
    const CHAVE = "tema";

    function temaGuardado() {
        try {
            return localStorage.getItem(CHAVE);
        } catch (erro) {
            // navegacao privada pode bloquear o localStorage
            return null;
        }
    }

    function aplicar(tema) {
        document.documentElement.dataset.tema = tema;

        // a barra de status do celular acompanha o tema
        const cor = tema === "claro" ? "#f3f5f3" : "#0e100f";
        document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
            meta.setAttribute("content", cor);
        });
    }

    aplicar(temaGuardado() || "escuro");

    // fica no window porque o botao no HTML chama onclick="trocarTema()"
    window.trocarTema = function () {
        const novo = document.documentElement.dataset.tema === "claro" ? "escuro" : "claro";

        aplicar(novo);

        try {
            localStorage.setItem(CHAVE, novo);
        } catch (erro) {
            // sem onde guardar, a troca vale so nessa visita
        }
    };
})();
