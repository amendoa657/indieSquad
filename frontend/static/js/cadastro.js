const etapaPerfil = document.getElementById("etapaPerfil");
const etapaFormulario = document.getElementById("etapaFormulario");
const botoesPerfil = document.querySelectorAll(".opcaoPerfil");
const botaoVoltar = document.getElementById("botaoVoltar");
const campoEspecialidade = document.getElementById("campoEspecialidade");
const especialidadeInput = document.getElementById("especialidade");
const formCadastro = document.getElementById("formCadastro");
const campoSenha = document.getElementById("senha");
const botaoOlho = document.getElementById("botaoOlho");

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
        // ajustar essa URL pro endereço real da API do back-end
        const resposta = await fetch("http://localhost:5000/api/cadastro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });

        if (!resposta.ok) {
            throw new Error("Erro ao criar conta");
        }

        const resultado = await resposta.json();
        console.log(resultado);
        // redirecionar apos cadastro /login
    } catch (erro) {
        console.error(erro);
        // mostrar mensagem de erro pro usuario na tela
    }
});
