
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

    // o objetivo da pessoa decide a tela inicial
    irPara(resposta.usuario.objetivo === "entrarProjeto" ? "busca.html" : "dashboard.html");
};
