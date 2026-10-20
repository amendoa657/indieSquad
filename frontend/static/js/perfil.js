
protegerPagina();


// sem handle no endereco, e o meu proprio perfil
const handleDoPerfil = parametro("handle");
let idDoPerfil = null;
let souEu = false;
let skillsDoBanco = [];
let ferramentasDoBanco = [];
const minhasFerramentas = new Set();

// o rotulo de cada item que falta pro perfil ficar completo
const FALTANDO = {
    bio: "escrever uma bio",
    skills: "adicionar uma função",
    disponibilidade: "dizer sua disponibilidade",
    colaboracao: "marcar que tipo de colaboração aceita",
    ferramentas: "adicionar suas ferramentas",
    links: "colar um link de portfólio",
};



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


// ---------- Ferramentas ----------

async function carregarFerramentas() {
    const minhas = (await pedir(`/usuarios/${idDoPerfil}/ferramentas`)) || [];

    minhasFerramentas.clear();
    minhas.forEach((ferramenta) => minhasFerramentas.add(ferramenta.id));

    listar("ferramentasPerfil", minhas, function (ferramenta) {
        return `<span class="mo-chip tagSkill">${escapar(ferramenta.nome)}</span>`;
    }, "Nenhuma ferramenta cadastrada ainda.");

    if (!souEu) return;

    if (ferramentasDoBanco.length === 0) {
        ferramentasDoBanco = (await pedir("/ferramentas")) || [];
    }

    const categorias = [...new Set(ferramentasDoBanco.map((f) => f.categoria))];

    escrever("botoesFerramenta", categorias.map(function (categoria) {
        const daCategoria = ferramentasDoBanco.filter((f) => f.categoria === categoria);

        return `
            <div class="grupoPerfil">
                <span class="tituloGrupoPerfil">${escapar(categoria)}</span>
                <div class="chipsGrupoPerfil">
                    ${daCategoria.map((f) => `
                        <button type="button" class="mo-chip botaoPerfil ${minhasFerramentas.has(f.id) ? "ativo" : ""}" data-id="${f.id}">
                            ${escapar(f.nome)}
                        </button>
                    `).join("")}
                </div>
            </div>
        `;
    }).join(""));

    document.querySelectorAll("#botoesFerramenta .botaoPerfil").forEach(function (botao) {
        botao.onclick = () => alternarFerramenta(Number(botao.dataset.id), botao);
    });
}


async function alternarFerramenta(idFerramenta, botao) {
    if (minhasFerramentas.has(idFerramenta)) {
        const resposta = await pedir(`/usuarios/${idDoPerfil}/ferramentas/${idFerramenta}`, "DELETE");
        if (!resposta) return;

        minhasFerramentas.delete(idFerramenta);
        botao.classList.remove("ativo");
    } else {
        const resposta = await pedir(`/usuarios/${idDoPerfil}/ferramentas`, "POST", { idFerramenta: idFerramenta });
        if (!resposta) return;

        minhasFerramentas.add(idFerramenta);
        botao.classList.add("ativo");
    }

    carregarFerramentas();
}


// ---------- Links de portfolio ----------

async function carregarLinks() {
    const links = (await pedir(`/usuarios/${idDoPerfil}/links`)) || [];

    // no cabecalho os links sao clicaveis; so o dono ve a lista de gerenciar
    listar("linksPerfil", links, function (link) {
        return `<a class="mo-chip tagSkill tagLink" href="${escapar(link.url)}" target="_blank" rel="noopener noreferrer">
            ${escapar(NOMES_LINK[link.tipo] || link.tipo)} ↗
        </a>`;
    }, "");

    if (!souEu) return;

    listar("meusLinks", links, function (link) {
        return `<span class="mo-chip tagSkill">${escapar(NOMES_LINK[link.tipo] || link.tipo)}
            <button type="button" class="botaoRemoverTag" onclick="removerLink(${link.id})">×</button></span>`;
    }, "Nenhum link ainda.");
}


async function adicionarLink() {
    avisar("");

    const url = valor("campoUrlLink");

    if (!url) {
        avisar("Cola o endereço do seu portfólio.");
        return;
    }

    const resposta = await pedir(`/usuarios/${idDoPerfil}/links`, "POST", {
        tipo: pegar("campoTipoLink").value,
        url: url,
    });

    if (!resposta) return;

    pegar("campoUrlLink").value = "";
    carregarPerfil();
}


async function removerLink(idLink) {
    const resposta = await pedir(`/links/${idLink}`, "DELETE");
    if (!resposta) return;

    carregarPerfil();
}


// ---------- Avaliacoes recebidas ----------

async function carregarAvaliacoesRecebidas() {
    const dados = await pedir(`/usuarios/${idDoPerfil}/avaliacoes`);
    if (!dados || dados.avaliacoes.length === 0) return;

    pegar("blocoAvaliacoesPerfil").classList.remove("escondido");

    listar("listaAvaliacoesPerfil", dados.avaliacoes, function (avaliacao) {
        return `
            <div class="mo-cartao cardResultado">
                <div class="topoCardResultado">
                    <h2>
                        <span class="avatarMembro">${escapar(avaliacao.avaliador.usuario.charAt(0).toUpperCase())}</span>
                        ${escapar(avaliacao.avaliador.usuario)}
                    </h2>
                    <span class="mo-selo statusResultado">${escapar(avaliacao.projeto.nome)}</span>
                </div>
                <div class="notasRecebidas">
                    <span class="notaGrande">${numero(avaliacao.nota, 0)}</span>
                    <div class="detalheNotas">
                        <span>Comunicação ${avaliacao.notaComunicacao}</span>
                        <span>Prazo ${avaliacao.notaPrazo}</span>
                        <span>Qualidade ${avaliacao.notaQualidade}</span>
                    </div>
                </div>
                ${avaliacao.comentario ? `<p class="descricaoResultado">“${escapar(avaliacao.comentario)}”</p>` : ""}
            </div>
        `;
    }, "");
}


// ---------- Perfil completo ----------

function mostrarPerfilCompleto(dados) {
    if (!souEu || !dados.faltando) {
        pegar("barraPerfilCompleto").classList.add("escondido");
        return;
    }

    // perfil cheio nao precisa de barra lembrando que esta cheio
    if (dados.faltando.length === 0) {
        pegar("barraPerfilCompleto").classList.add("escondido");
        return;
    }

    pegar("barraPerfilCompleto").classList.remove("escondido");
    escrever("percentualPerfil", `${dados.perfilCompleto}%`);
    pegar("progressoPerfil").style.transform = `scaleX(${dados.perfilCompleto / 100})`;

    const itens = dados.faltando.map((chave) => FALTANDO[chave] || chave);
    escrever("faltandoPerfil", `Falta ${escapar(itens.join(", "))}.`);
}


async function carregarPerfil() {
    // perfil de outra pessoa vem pelo apelido; o meu vem pelo id
    const dados = handleDoPerfil
        ? await pedir(`/usuarios/handle/${encodeURIComponent(handleDoPerfil)}`)
        : await pedir(`/usuarios/${meuId()}`);

    if (!dados) return;

    idDoPerfil = dados.id;
    souEu = dados.id === meuId();

    const skills = (await pedir(`/usuarios/${idDoPerfil}/skills/`)) || [];
    const numeros = (await pedir(`/usuarios/${idDoPerfil}/estatisticas`)) || {};
    const projetos = (await pedir(`/usuarios/projeto/${idDoPerfil}`)) || [];

    // cabecalho
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
            ? `${numero(reputacao.media)} <span class="detalheNota">de ${plural(reputacao.total, "avaliação", "avaliações")}</span>`
            : `<span class="detalheNota">Sem avaliação ainda</span>`);
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
            return `<span class="mo-chip tagSkill">${escapar(linha)}</span>`;
        }, "Perfil ainda não preenchido.");
    }

    // so eu mexo nas minhas funcoes; no perfil de outra pessoa e so leitura
    listar("skillsPerfil", skills, function (skill) {
        const remover = souEu
            ? `<button type="button" class="botaoRemoverTag" onclick="removerSkill(${skill.id})">×</button>`
            : "";

        return `<span class="mo-chip tagSkill">${escapar(skill.nome)} · ${escapar(NIVEIS[skill.nivel])}${remover}</span>`;
    }, "Nenhuma skill cadastrada ainda.");

    listar("projetosPerfil", projetos, function (projeto) {
        const papel = projeto.ehCriador ? "Criador" : "Membro";

        return `
            <div class="mo-cartao cardResultado cardClicavel" onclick="irPara('projeto.html?id=${projeto.id}')">
                <div class="topoCardResultado">
                    <h2>${escapar(projeto.nome)}</h2>
                    <span class="mo-selo statusResultado">${escapar(rotulo(projeto.status))}</span>
                </div>
                <p class="descricaoResultado">${escapar(projeto.descricao) || "Sem descrição"}</p>
                <div class="tagsResultado"><span class="mo-chip tagSkill">${papel}</span></div>
            </div>
        `;
    }, "Nenhum projeto ainda.");

    mostrarPerfilCompleto(dados);
    carregarFerramentas();
    carregarLinks();
    carregarAvaliacoesRecebidas();

    // os blocos de edicao so aparecem no meu proprio perfil
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

        pegar("blocoSkills").classList.remove("escondido");
        pegar("blocoFerramentas").classList.remove("escondido");
        pegar("blocoLinks").classList.remove("escondido");
    } else {
        pegar("botaoEditar").classList.add("escondido");
        pegar("blocoEdicao").classList.add("escondido");

        pegar("blocoSkills").classList.add("escondido");
        pegar("blocoFerramentas").classList.add("escondido");
        pegar("blocoLinks").classList.add("escondido");
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

    // o localStorage guarda o nome e o apelido pra tela nao ficar desatualizada
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
