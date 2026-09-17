
ligarOlhinho();


pegar("formLogin").onsubmit = async function (evento) {
    evento.preventDefault();  
    avisar("");  

    const resposta = await pedir("/auth/login", "POST", {
        email: valor("email"),
        senha: valor("senha"),
    });

    if (!resposta) return;    

    localStorage.setItem("token", resposta.token);
    irPara("dashboard.html");
};
