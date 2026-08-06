const formLogin = document.getElementById("formLogin");
const campoSenha = document.getElementById("senha");
const botaoOlho = document.getElementById("botaoOlho");

botaoOlho.addEventListener("click", () => {
    const tipoAtual = campoSenha.getAttribute("type");
    campoSenha.setAttribute("type", tipoAtual === "password" ? "text" : "password");
});

formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const dados = {
        email: document.getElementById("email").value,
        senha: campoSenha.value,
    };

    try {
        // ajustar essa URL pro endereço real da API do back-end
        const resposta = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });

        if (!resposta.ok) {
            throw new Error("Credenciais invalidas");
        }

        const resultado = await resposta.json();
        console.log(resultado);
        // redirecionar pra pagina apos login 
    } catch (erro) {
        console.error(erro);
        // mostrar mensagem de erro pro usuario na tela
    }
});
