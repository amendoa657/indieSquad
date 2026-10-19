
ligarOlhinho();


pegar("formLogin").onsubmit = async function (evento) {
    evento.preventDefault();
    avisar("");

    const resposta = await pedir("/auth/login", "POST", {
        email: valor("email"),
        senha: valor("senha"),
    });

    if (!resposta) return;

    guardarLogin(resposta);

    // Quem veio procurar projeto cai direto na busca; quem veio montar equipe
    // cai no dashboard dos projetos dele.
    irPara(resposta.usuario.objetivo === "entrarProjeto" ? "busca.html" : "dashboard.html");
};
