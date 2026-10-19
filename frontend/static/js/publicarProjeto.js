protegerPagina();

let parceriaEscolhida = "";
let skillsDoBanco = [];
const vagasEscolhidas = new Set();


document.querySelectorAll(".opcaoParceria").forEach(function (card) {
    card.onclick = function () {
        document.querySelectorAll(".opcaoParceria").forEach((c) => c.classList.remove("ativo"));
        card.classList.add("ativo");
        parceriaEscolhida = card.dataset.parceria;
    };
});


// Os perfis vêm do catálogo do banco, com o id de cada função.
//
// Antes os botões eram texto fixo no HTML e o front criava uma skill nova a
// cada publicação. Era assim que o banco acabava com "Programador",
// "programador" e "Progamador" convivendo, e a busca por função parava de
// funcionar.
async function carregarPerfis() {
    const skills = await pedir("/skills");
    if (!skills) return;

    skillsDoBanco = skills;

    // Agrupadas por categoria, pra pessoa achar a função que precisa de
    // relance em vez de varrer 22 botões em sequência.
    const categorias = [...new Set(skills.map((skill) => skill.categoria))];

    escrever("botoesPerfil", categorias.map(function (categoria) {
        const daCategoria = skills.filter((skill) => skill.categoria === categoria);

        return `
            <div class="grupoPerfil">
                <span class="tituloGrupoPerfil">${escapar(categoria)}</span>
                <div class="chipsGrupoPerfil">
                    ${daCategoria.map((skill) => `<button type="button" class="botaoPerfil" data-id="${skill.id}">${escapar(skill.nome)}</button>`).join("")}
                </div>
            </div>
        `;
    }).join(""));

    document.querySelectorAll(".botaoPerfil").forEach(function (botao) {
        botao.onclick = function () {
            const id = Number(botao.dataset.id);

            if (vagasEscolhidas.has(id)) {
                vagasEscolhidas.delete(id);
                botao.classList.remove("ativo");
            } else {
                vagasEscolhidas.add(id);
                botao.classList.add("ativo");
            }
        };
    });
}


// Os marcos são escritos separados por vírgula e viram uma lista.
function marcosDigitados() {
    return valor("marcoProjeto")
        .split(",")
        .map((marco) => marco.trim())
        .filter((marco) => marco.length > 0);
}


pegar("formPublicarProjeto").onsubmit = async function (evento) {
    evento.preventDefault();
    avisar("");

    if (vagasEscolhidas.size === 0) {
        avisar("Escolhe pelo menos um perfil que você precisa na equipe.");
        return;
    }

    if (!parceriaEscolhida) {
        avisar("Escolhe o tipo de parceria.");
        return;
    }

    const nome = valor("nomeProjeto");

    // Agora tudo que o formulário pede é realmente salvo: gênero, engine,
    // tipo de parceria, duração e os marcos.
    const projeto = await pedir("/projetos", "POST", {
        nome: nome,
        descricao: valor("descricaoProjeto"),
        status: "ativo",
        genero: valor("generoProjeto"),
        engine: valor("engineProjeto"),
        tipoParceria: parceriaEscolhida,
        duracaoEstimada: valor("duracaoProjeto"),
        marcos: marcosDigitados(),
    });

    if (!projeto) return;

    for (const idSkill of vagasEscolhidas) {
        const skill = skillsDoBanco.find((item) => item.id === idSkill);

        await pedir("/vagas", "POST", {
            titulo: skill.nome,
            descricao: `Vaga de ${skill.nome} para o projeto ${nome}`,
            idProjeto: projeto.id,
            idSkill: idSkill,
        });
    }

    irPara(`projeto.html?id=${projeto.id}`);
};

carregarPerfis();
