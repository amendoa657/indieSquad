
iniciarPagina();

async function carregarPerfil() {
    const dados = await pedir(`/usuarios/${meuId()}`);
    if (!dados) return;

    pegar("nomePerfil").value = dados.usuario || "";
    pegar("emailPerfil").value = dados.email || "";
    pegar("bioPerfil").value = dados.bio || "";

    const skills = await pedir(`/usuarios/${meuId()}/skills/`);
    if (!skills) return;

    listar("skillsPerfil", skills, function (skill) {
        return `<span class="tagSkill">${skill.nome}</span>`;
    }, "Nenhuma skill cadastrada ainda.");
}


pegar("formPerfil").onsubmit = async function (evento) {
    evento.preventDefault();
    avisar("");
    avisarSucesso("");

    const resposta = await pedir(`/usuarios/atualizar/${meuId()}`, "PUT", {
        usuario: valor("nomePerfil"),
        email: valor("emailPerfil"),
        bio: valor("bioPerfil"),
    });

    if (!resposta) return;

    avisarSucesso("Perfil atualizado com sucesso!");
};

carregarPerfil();
