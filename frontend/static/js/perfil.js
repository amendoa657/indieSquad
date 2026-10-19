
protegerPagina();


// Sem handle no endereço, é o meu próprio perfil.
const handleDoPerfil = parametro("handle");
let idDoPerfil = null;
let souEu = false;
let skillsDoBanco = [];


pegar("botaoEditar").onclick = function () {
    pegar("blocoEdicao").classList.toggle("escondido");
};


async function adicionarSkill() {
    const idSkill = Number(pegar("campoSkill").value);
    const nivel = Number(pegar("campoNivel").value);

    if (!idSkill) {
        avisar("Escolhe uma função.");
        return;
    }

    const resposta = await pedir(`/usuarios/${idDoPerfil}/skills/`, "POST", {
        idSkill: idSkill,
        nivel: nivel,
    });

    if (!resposta) return;

    carregarPerfil();
}


async function removerSkill(idSkill) {
    const resposta = await pedir(`/usuarios/${idDoPerfil}/skills/${idSkill}`, "DELETE");
    if (!resposta) return;

    carregarPerfil();
}


async function carregarSkillsDoBanco() {
    const skills = await pedir("/skills");
    if (!skills) return;

    skillsDoBanco = skills;

    if (pegar("campoSkill")) {
        pegar("campoSkill").innerHTML =
            `<option value="">Escolhe uma função...</option>` +
            skills.map((skill) => `<option value="${skill.id}">${escapar(skill.nome)}</option>`).join("");
    }
}


async function carregarPerfil() {
    // Perfil de outra pessoa vem pelo apelido; o meu vem pelo id.
    const dados = handleDoPerfil
        ? await pedir(`/usuarios/handle/${encodeURIComponent(handleDoPerfil)}`)
        : await pedir(`/usuarios/${meuId()}`);

    if (!dados) return;

    idDoPerfil = dados.id;
    souEu = dados.id === meuId();

    const skills = (await pedir(`/usuarios/${idDoPerfil}/skills/`)) || [];
    const numeros = (await pedir(`/usuarios/${idDoPerfil}/estatisticas`)) || {};
    const projetos = (await pedir(`/usuarios/projeto/${idDoPerfil}`)) || [];

    // Cabeçalho. O avatar é a primeira letra do nome.
    escrever("avatarPerfil", escapar(dados.usuario.charAt(0).toUpperCase()));
    escrever("nomePerfil", escapar(dados.usuario));
    escrever("handlePerfil", `@${escapar(dados.handle)}`);
    escrever("funcaoPerfil", skills.length > 0 ? escapar(skills[0].nome) : "Sem função definida");
    escrever("bioPerfil", escapar(dados.bio) || "Sem bio ainda.");

    if (dados.dataCriacao) {
        escrever("membroDesde", `Membro desde ${new Date(dados.dataCriacao).getFullYear()}`);
    }

    escrever("totalProjetos", numeros.totalProjetos || 0);
    escrever("totalColaboracoes", numeros.colaboracoes || 0);
    escrever("taxaConclusao", `${numeros.taxaConclusao || 0}%`);

    if (pegar("notaPerfil")) {
        const reputacao = numeros.reputacao || { total: 0, media: 0 };

        escrever("notaPerfil", reputacao.total > 0
            ? `${reputacao.media} <span class="detalheNota">de ${reputacao.total} avaliação(ões)</span>`
            : "Sem avaliação ainda");
    }

    if (pegar("objetivoPerfil")) {
        const linhas = [
            OBJETIVOS[dados.objetivo],
            dados.disponibilidadeHoras ? `${dados.disponibilidadeHoras}h por semana` : null,
            [
                dados.aceitaPortfolio ? "Portfólio" : null,
                dados.aceitaRevenueShare ? "Divisão de lucro" : null,
                dados.aceitaRemunerado ? "Remunerado" : null,
            ].filter((item) => item).join(" · ") || null,
        ].filter((item) => item);

        listar("objetivoPerfil", linhas, function (linha) {
            return `<span class="tagSkill">${escapar(linha)}</span>`;
        }, "Perfil ainda não preenchido.");
    }

    // Só eu mexo nas minhas funções; no perfil de outra pessoa é só leitura.
    listar("skillsPerfil", skills, function (skill) {
        const remover = souEu
            ? `<button type="button" class="botaoRemoverTag" onclick="removerSkill(${skill.id})">×</button>`
            : "";

        return `<span class="tagSkill">${escapar(skill.nome)} · ${escapar(NIVEIS[skill.nivel])}${remover}</span>`;
    }, "Nenhuma skill cadastrada ainda.");

    listar("projetosPerfil", projetos, function (projeto) {
        const papel = projeto.ehCriador ? "Criador" : "Membro";

        return `
            <div class="cardResultado cardClicavel" onclick="irPara('projeto.html?id=${projeto.id}')">
                <div class="topoCardResultado">
                    <h2>${escapar(projeto.nome)}</h2>
                    <span class="statusResultado">${escapar(projeto.status)}</span>
                </div>
                <p class="descricaoResultado">${escapar(projeto.descricao) || "Sem descrição"}</p>
                <div class="tagsResultado"><span class="tagSkill">${papel}</span></div>
            </div>
        `;
    }, "Nenhum projeto ainda.");

    // Os blocos de edição só aparecem no meu próprio perfil.
    if (souEu) {
        pegar("botaoEditar").classList.remove("escondido");

        pegar("campoNome").value = dados.usuario || "";
        pegar("campoHandle").value = dados.handle || "";
        pegar("campoEmail").value = dados.email || "";
        pegar("campoBio").value = dados.bio || "";
        pegar("campoObjetivo").value = dados.objetivo || "ambos";
        pegar("campoHoras").value = dados.disponibilidadeHoras || "";
        pegar("campoPortfolio").checked = dados.aceitaPortfolio;
        pegar("campoRevenueShare").checked = dados.aceitaRevenueShare;
        pegar("campoRemunerado").checked = dados.aceitaRemunerado;

        if (pegar("blocoSkills")) {
            pegar("blocoSkills").classList.remove("escondido");
        }
    } else {
        pegar("botaoEditar").classList.add("escondido");
        pegar("blocoEdicao").classList.add("escondido");

        if (pegar("blocoSkills")) {
            pegar("blocoSkills").classList.add("escondido");
        }
    }
}


pegar("formPerfil").onsubmit = async function (evento) {
    evento.preventDefault();
    avisar("");
    avisarSucesso("");

    const resposta = await pedir(`/usuarios/atualizar/${idDoPerfil}`, "PUT", {
        usuario: valor("campoNome"),
        handle: valor("campoHandle"),
        email: valor("campoEmail"),
        bio: valor("campoBio"),
        objetivo: pegar("campoObjetivo").value,
        disponibilidadeHoras: valor("campoHoras") ? Number(valor("campoHoras")) : null,
        aceitaPortfolio: pegar("campoPortfolio").checked,
        aceitaRevenueShare: pegar("campoRevenueShare").checked,
        aceitaRemunerado: pegar("campoRemunerado").checked,
    });

    if (!resposta) return;

    // O localStorage guarda o nome e o apelido pra tela não ficar desatualizada.
    guardarLogin({ token: localStorage.getItem("token"), usuario: resposta });

    avisarSucesso("Perfil atualizado com sucesso!");

    pegar("blocoEdicao").classList.add("escondido");
    carregarPerfil();
};


pegar("formSenha").onsubmit = async function (evento) {
    evento.preventDefault();
    avisar("");
    avisarSucesso("");

    const resposta = await pedir("/usuarios/senha", "PUT", {
        senhaAtual: valor("campoSenhaAtual"),
        senhaNova: valor("campoSenhaNova"),
    });

    if (!resposta) return;

    pegar("campoSenhaAtual").value = "";
    pegar("campoSenhaNova").value = "";
    avisarSucesso("Senha alterada com sucesso!");
};


carregarSkillsDoBanco();
carregarPerfil();
