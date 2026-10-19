let objetivoEscolhido = "";

ligarOlhinho();


document.querySelectorAll(".opcaoPerfil").forEach(function (botao) {
    botao.onclick = function () {
        // "montarEquipe" ou "entrarProjeto". Isso não é só um rótulo: decide
        // em qual tela a pessoa cai depois do login e entra como filtro na busca.
        objetivoEscolhido = botao.dataset.objetivo;

        pegar("etapaPerfil").classList.add("etapaEscondida");
        pegar("etapaFormulario").classList.add("etapaVisivel");
    };
});


pegar("botaoVoltar").onclick = function (evento) {
    evento.preventDefault();
    pegar("etapaFormulario").classList.remove("etapaVisivel");
    pegar("etapaPerfil").classList.remove("etapaEscondida");
};


// Sugere um apelido a partir do nome, pra pessoa não ter que pensar nisso.
pegar("nome").oninput = function () {
    const campoHandle = pegar("handle");

    if (campoHandle.dataset.editado === "sim") {
        return;
    }

    campoHandle.value = valor("nome")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 30);
};

pegar("handle").oninput = function () {
    pegar("handle").dataset.editado = "sim";
};


pegar("formCadastro").onsubmit = async function (evento) {
    evento.preventDefault();
    avisar("");

    const resposta = await pedir("/auth/registrar", "POST", {
        nome: valor("nome"),
        handle: valor("handle"),
        email: valor("email"),
        senha: valor("senha"),
        objetivo: objetivoEscolhido || "ambos",
    });

    if (!resposta) return;

    // O cadastro já devolve o token, então a pessoa entra direto em vez de
    // ter que digitar e-mail e senha de novo na tela de login.
    guardarLogin(resposta);
    irPara("perfil.html?completar=1");
};
