let objetivoEscolhido = "";

ligarOlhinho();


document.querySelectorAll(".opcaoPerfil").forEach(function (botao) {
    botao.onclick = function () {
        // "montarEquipe" ou "entrarProjeto"
        objetivoEscolhido = botao.dataset.objetivo;

        pegar("etapaPerfil").classList.add("etapaEscondida");
        pegar("etapaFormulario").classList.add("etapaVisivel");
        escrever("passoCadastro", "2/2");
        pegar("nome").focus();
    };
});


pegar("botaoVoltar").onclick = function (evento) {
    evento.preventDefault();
    pegar("etapaFormulario").classList.remove("etapaVisivel");
    pegar("etapaPerfil").classList.remove("etapaEscondida");
    escrever("passoCadastro", "1/2");
};


// o apelido decide o bonequinho: a pessoa ve o dela nascendo enquanto digita
function atualizarSprite() {
    pegar("spriteApelido").setAttribute("semente", valor("handle") || "?");
}


// sugere um apelido a partir do nome, pra pessoa nao ter que pensar nisso
pegar("nome").oninput = function () {
    const campoHandle = pegar("handle");

    // se a pessoa ja mexeu no apelido na mao para de sugerir pra nao apagar o que ela escreveu
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

    atualizarSprite();
};

pegar("handle").oninput = function () {
    pegar("handle").dataset.editado = "sim";
    atualizarSprite();
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

    // o cadastro ja devolve o token, entao a pessoa entra direto
    guardarLogin(resposta);
    irPara("onboarding.html");
};
