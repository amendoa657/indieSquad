let perfilEscolhido = "";

ligarOlhinho();


document.querySelectorAll(".opcaoPerfil").forEach(function (botao) {
    botao.onclick = function () {
        perfilEscolhido = botao.dataset.perfil;   // "desenvolvedor" ou "profissional"

        
        pegar("etapaPerfil").classList.add("etapaEscondida");
        pegar("etapaFormulario").classList.add("etapaVisivel");

       
        const ehProfissional = perfilEscolhido === "profissional";
        pegar("campoEspecialidade").classList.toggle("campoVisivel", ehProfissional);
        pegar("especialidade").required = ehProfissional;
    };
});


pegar("botaoVoltar").onclick = function (evento) {
    evento.preventDefault();
    pegar("etapaFormulario").classList.remove("etapaVisivel");
    pegar("etapaPerfil").classList.remove("etapaEscondida");
};



pegar("formCadastro").onsubmit = async function (evento) {
    evento.preventDefault();
    avisar("");

    const dados = {
        nome: valor("nome"),
        email: valor("email"),
        senha: valor("senha"),
        perfil: perfilEscolhido,
    };

    
    if (perfilEscolhido === "profissional") {
        dados.especialidade = valor("especialidade");
    }

    const resposta = await pedir("/auth/registrar", "POST", dados);

    if (!resposta) return;

    irPara("login.html");
};
