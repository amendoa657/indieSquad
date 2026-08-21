const token = localStorage.getItem("token");
const idUsuario = token ? token.split("-")[1] : null;

const mensagemErro = document.getElementById("mensagemErro");
const mensagemSucesso = document.getElementById("mensagemSucesso");
const formPerfil = document.getElementById("formPerfil");
const skillsPerfil = document.getElementById("skillsPerfil");

async function carregarPerfil() {
    try {
        const resposta = await fetch(`http://localhost:5000/usuarios/${idUsuario}`);
        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || "Erro ao carregar perfil");
        }

        document.getElementById("nomePerfil").value = dados.usuario || "";
        document.getElementById("emailPerfil").value = dados.email || "";
        document.getElementById("bioPerfil").value = dados.bio || "";
    } catch (erro) {
        console.error(erro);
        mensagemErro.textContent = "Não foi possível carregar seu perfil.";
    }

    try {
        const respostaSkills = await fetch(`http://localhost:5000/usuarios/${idUsuario}/skills/`);
        const skills = await respostaSkills.json();

        skillsPerfil.innerHTML = skills.length > 0
            ? skills.map((skill) => `<span class="tagSkill">${skill.nome}</span>`).join("")
            : '<p class="mensagemVazia">Nenhuma skill cadastrada ainda.</p>';
    } catch (erro) {
        console.error(erro);
    }
}

formPerfil.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensagemErro.textContent = "";
    mensagemSucesso.textContent = "";

    const dados = {
        usuario: document.getElementById("nomePerfil").value.trim(),
        email: document.getElementById("emailPerfil").value.trim(),
        bio: document.getElementById("bioPerfil").value.trim(),
    };

    try {
        const resposta = await fetch(`http://localhost:5000/usuarios/atualizar/${idUsuario}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });

        if (!resposta.ok) {
            const erroDados = await resposta.json().catch(() => ({}));
            throw new Error(erroDados.erro || "Erro ao salvar perfil");
        }

        mensagemSucesso.textContent = "Perfil atualizado com sucesso!";
    } catch (erro) {
        console.error(erro);
        const texto = erro.message === "Failed to fetch"
            ? "Não foi possível conectar ao servidor. Verifique se o back-end está rodando."
            : erro.message;
        mensagemErro.textContent = texto;
    }
});

carregarPerfil();
