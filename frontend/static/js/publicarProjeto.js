iniciarPagina();

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

escrever("chipsPerfil", PERFIS.map(function (perfil) {
    return `<button type="button" class="chipPerfil" onclick="this.classList.toggle('ativo')">${perfil}</button>`;
}).join(""));

document.querySelectorAll(".opcaoParceria").forEach(function (card) {
    card.onclick = function () {
        document.querySelectorAll(".opcaoParceria").forEach((c) => c.classList.remove("ativo"));
        card.classList.add("ativo");
    };
});


async function acharOuCriarSkill(nome) {
    const skills = (await pedir("/skills")) || [];
    const jaExiste = skills.find((skill) => skill.nome === nome);

    if (jaExiste) return jaExiste.id;

    const nova = await pedir("/skills", "POST", { nome: nome });
    return nova ? nova.id : null;
}


pegar("formPublicarProjeto").onsubmit = async function (evento) {
    evento.preventDefault();
    avisar("");

    const nome = valor("nomeProjeto");

    const perfisEscolhidos = Array.from(document.querySelectorAll(".chipPerfil.ativo"))
        .map((chip) => chip.textContent.trim());


    const projeto = await pedir("/projetos", "POST", {
        nome: nome,
        descricao: valor("descricaoProjeto"),
        status: "ativo",
        usuario_id: meuId(),
    });

    if (!projeto) return;

    for (const perfil of perfisEscolhidos) {
        await pedir("/vagas", "POST", {
            titulo: perfil,
            descricao: `Vaga de ${perfil} para o projeto ${nome}`,
            status: "aberta",
            idProjeto: projeto.id,
            idSkill: await acharOuCriarSkill(perfil),
        });
    }

    irPara("dashboard.html");
};
