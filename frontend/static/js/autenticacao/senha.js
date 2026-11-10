// o olhinho que mostra e esconde a senha

function ligarOlhinho() {
    const botao = pegar("botaoOlho");

    if (!botao) {
        return;
    }

    botao.onclick = function () {
        const campo = pegar("senha");
        campo.type = campo.type === "password" ? "text" : "password";
    };
}
