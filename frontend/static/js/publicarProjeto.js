const token = localStorage.getItem("token");
const idUsuario = token ? token.split("-")[1] : null;

const PERFIS = [
    "Artista 2D",
    "Artista 3D",
    "Animador",
    "Compositor",
    "Sound Designer",
    "Dublador",
    "Roteirista",
    "Programador",
    "Game Designer",
    "QA Tester",
];

const perfisSelecionados = new Set();
let parceriaSelecionada = null;
let etapaAtual = 1;

const mensagemErro = document.getElementById("mensagemErro");
const chipsPerfil = document.getElementById("chipsPerfil");
const listaMarcos = document.getElementById("listaMarcos");
const botaoAdicionarMarco = document.getElementById("botaoAdicionarMarco");
const formPublicarProjeto = document.getElementById("formPublicarProjeto");

function renderizarChipsPerfil() {
    chipsPerfil.innerHTML = "";

    PERFIS.forEach((perfil) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chipPerfil";
        chip.textContent = perfil;

        chip.addEventListener("click", () => {
            if (perfisSelecionados.has(perfil)) {
                perfisSelecionados.delete(perfil);
                chip.classList.remove("ativo");
            } else {
                perfisSelecionados.add(perfil);
                chip.classList.add("ativo");
            }
        });

        chipsPerfil.appendChild(chip);
    });
}

botaoAdicionarMarco.addEventListener("click", () => {
    const numero = listaMarcos.querySelectorAll(".campoMarco").length + 1;
    const input = document.createElement("input");
    input.type = "text";
    input.className = "campoMarco";
    input.placeholder = `Marco ${numero} (opcional)`;
    listaMarcos.appendChild(input);
});

document.querySelectorAll(".opcaoParceria").forEach((opcao) => {
    opcao.addEventListener("click", () => {
        document.querySelectorAll(".opcaoParceria").forEach((o) => o.classList.remove("ativo"));
        opcao.classList.add("ativo");
        parceriaSelecionada = opcao.dataset.parceria;
    });
});

function irParaEtapa(numero) {
    document.querySelectorAll(".etapaPublicar").forEach((etapa) => etapa.classList.remove("etapaAtiva"));
    document.getElementById(`etapa${numero}`).classList.add("etapaAtiva");

    document.querySelectorAll(".segmentoEtapa").forEach((segmento, indice) => {
        segmento.classList.toggle("preenchido", indice < numero);
    });

    etapaAtual = numero;
    if (mensagemErro) mensagemErro.textContent = "";
}

document.getElementById("botaoProximo1").addEventListener("click", () => {
    const nome = document.getElementById("nomeProjeto").value.trim();
    const descricao = document.getElementById("descricaoProjeto").value.trim();

    if (!nome || !descricao) {
        mensagemErro.textContent = "Preencha nome e descrição do projeto.";
        return;
    }

    irParaEtapa(2);
});

document.getElementById("botaoVoltar2").addEventListener("click", () => irParaEtapa(1));
document.getElementById("botaoProximo2").addEventListener("click", () => irParaEtapa(3));
document.getElementById("botaoVoltar3").addEventListener("click", () => irParaEtapa(2));

async function resolverIdSkill(nomePerfil) {
    const resposta = await fetch("http://localhost:5000/skills");
    const skills = await resposta.json();

    const existente = skills.find((skill) => skill.nome === nomePerfil);
    if (existente) return existente.id;

    const respostaCriacao = await fetch("http://localhost:5000/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomePerfil }),
    });

    const dadosCriacao = await respostaCriacao.json();
    return dadosCriacao.id;
}

formPublicarProjeto.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (mensagemErro) mensagemErro.textContent = "";

    const nome = document.getElementById("nomeProjeto").value.trim();
    const descricao = document.getElementById("descricaoProjeto").value.trim();

    // ASSUME: Gênero, Engine, Marcos, Tipo de Parceria e Duração ainda NÃO tem
    // coluna/tabela no banco pra serem salvos. Só nome, descricao e status
    // (Projeto) + as vagas por perfil selecionado são persistidos de verdade.
    try {
        const respostaProjeto = await fetch("http://localhost:5000/projetos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome,
                descricao,
                status: "ativo",
                usuario_id: idUsuario,
            }),
        });

        const dadosProjeto = await respostaProjeto.json();

        if (!respostaProjeto.ok) {
            throw new Error(dadosProjeto.erro || "Erro ao publicar projeto");
        }

        const idProjeto = dadosProjeto.id;

        for (const perfil of perfisSelecionados) {
            const idSkill = await resolverIdSkill(perfil);

            await fetch("http://localhost:5000/vagas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    titulo: perfil,
                    descricao: `Vaga de ${perfil} para o projeto ${nome}`,
                    status: "aberta",
                    idProjeto,
                    idSkill,
                }),
            });
        }

        window.location.href = "dashboard.html";
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

renderizarChipsPerfil();
irParaEtapa(1);
