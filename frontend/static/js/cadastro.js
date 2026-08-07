const etapaPerfil = document.getElementById("etapaPerfil");
const etapaFormulario = document.getElementById("etapaFormulario");
const botoesPerfil = document.querySelectorAll(".opcaoPerfil");
const botaoVoltar = document.getElementById("botaoVoltar");
const campoEspecialidade = document.getElementById("campoEspecialidade");
const especialidadeInput = document.getElementById("especialidade");
const formCadastro = document.getElementById("formCadastro");
const campoSenha = document.getElementById("senha");
const botaoOlho = document.getElementById("botaoOlho");
const mensagemErro = document.getElementById("mensagemErro");

let perfilSelecionado = null;

botoesPerfil.forEach((botao) => {
    botao.addEventListener("click", () => {
        perfilSelecionado = botao.dataset.perfil;

        etapaPerfil.classList.add("etapaEscondida");
        etapaFormulario.classList.add("etapaVisivel");

        if (perfilSelecionado === "profissional") {
            campoEspecialidade.classList.add("campoVisivel");
            especialidadeInput.required = true;
        } else {
            campoEspecialidade.classList.remove("campoVisivel");
            especialidadeInput.required = false;
        }
    });
});

botaoVoltar.addEventListener("click", (evento) => {
    evento.preventDefault();
    etapaFormulario.classList.remove("etapaVisivel");
    etapaPerfil.classList.remove("etapaEscondida");
});

botaoOlho.addEventListener("click", () => {
    const tipoAtual = campoSenha.getAttribute("type");
    campoSenha.setAttribute("type", tipoAtual === "password" ? "text" : "password");
});

formCadastro.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (mensagemErro) mensagemErro.textContent = "";

    const dados = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        senha: campoSenha.value,
        perfil: perfilSelecionado,
    };

    if (perfilSelecionado === "profissional") {
        dados.especialidade = especialidadeInput.value;
    }

    try {
        const resposta = await fetch("http://localhost:5000/auth/registrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao criar conta");
        }

        localStorage.setItem("token", resultado.token);
        window.location.href = "/login";
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