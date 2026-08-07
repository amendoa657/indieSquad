const formLogin = document.getElementById("formLogin");
const campoSenha = document.getElementById("senha");
const botaoOlho = document.getElementById("botaoOlho");
const mensagemErro = document.getElementById("mensagemErro");

botaoOlho.addEventListener("click", () => {
    const tipoAtual = campoSenha.getAttribute("type");
    campoSenha.setAttribute("type", tipoAtual === "password" ? "text" : "password");
});

formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (mensagemErro) mensagemErro.textContent = "";

    const dados = {
        email: document.getElementById("email").value,
        senha: campoSenha.value,
    };

    try {
        const resposta = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Credenciais invalidas");
        }

        localStorage.setItem("token", resultado.token);
        window.location.href = "/dashboard";
    } catch (erro) {
        console.error(erro);
        const texto = erro.message === "Failed to fetch"
            ? "Não foi possível conectar ao servidor. Verifique se o back-end está rodando."
            : erro.message;

        if (mensagemErro) {
            mensagemErro.textContent = texto;
        } else {
            alert(texto);
        }
    }
});