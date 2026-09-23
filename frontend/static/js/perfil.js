
protegerPagina();


// O botão "Editar" mostra e esconde o formulário.
pegar("botaoEditar").onclick = function () {
    pegar("blocoEdicao").classList.toggle("escondido");
};


async function carregarPerfil() {
    const dados = await pedir(`/usuarios/${meuId()}`);
    if (!dados) return;

    const skills = (await pedir(`/usuarios/${meuId()}/skills/`)) || [];
    const numeros = (await pedir(`/dashboard/${meuId()}`)) || {};
    const projetos = (await pedir(`/usuarios/projeto/${meuId()}`)) || [];

    // Cabeçalho. O avatar é a primeira letra do nome.
    escrever("avatarPerfil", dados.usuario.charAt(0).toUpperCase());
    escrever("nomePerfil", dados.usuario);
    escrever("funcaoPerfil", skills.length > 0 ? skills[0].nome : "Sem função definida");
    escrever("bioPerfil", dados.bio || "Sem bio ainda.");

    if (dados.dataCriacao) {
        escrever("membroDesde", `Membro desde ${new Date(dados.dataCriacao).getFullYear()}`);
    }

    escrever("totalProjetos", numeros.totalProjetos || 0);
    escrever("totalColaboracoes", numeros.colaboracoes || 0);
    escrever("taxaConclusao", `${numeros.taxaConclusao || 0}%`);

    listar("skillsPerfil", skills, function (skill) {
        return `<span class="tagSkill">${skill.nome}</span>`;
    }, "Nenhuma skill cadastrada ainda.");

    listar("projetosPerfil", projetos, function (projeto) {
        return `
            <div class="cardResultado cardClicavel" onclick="irPara('projeto.html?id=${projeto.id}')">
                <div class="topoCardResultado">
                    <h2>${projeto.nome}</h2>
                    <span class="statusResultado">${projeto.status}</span>
                </div>
                <p class="descricaoResultado">${projeto.descricao || "Sem descrição"}</p>
            </div>
        `;
    }, "Nenhum projeto ainda.");

    // Enche o formulário de edição com o que já está salvo.
    pegar("campoNome").value = dados.usuario || "";
    pegar("campoEmail").value = dados.email || "";
    pegar("campoBio").value = dados.bio || "";
}


pegar("formPerfil").onsubmit = async function (evento) {
    evento.preventDefault();
    avisar("");
    avisarSucesso("");

    const resposta = await pedir(`/usuarios/atualizar/${meuId()}`, "PUT", {
        usuario: valor("campoNome"),
        email: valor("campoEmail"),
        bio: valor("campoBio"),
    });

    if (!resposta) return;

    avisarSucesso("Perfil atualizado com sucesso!");

    // Fecha a edição e recarrega, pra tela de cima já mostrar o que mudou.
    pegar("blocoEdicao").classList.add("escondido");
    carregarPerfil();
};

carregarPerfil();
