
protegerPagina();


// sem handle no endereco, e o meu proprio perfil
const handleDoPerfil = parametro("handle");
let idDoPerfil = null;
let souEu = false;
let skillsDoBanco = [];

// a cor do topo do perfil: a escolhida pela pessoa ou, sem escolha, a da funcao principal
let corAutomatica = "";
let corSalva = "";
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



function pintarBanner(cor) {
    pegar("cartaoHeroi").className = `bannerPerfil ${cor ? `classe-${cor}` : corAutomatica}`;
}

// escolher a cor ja mostra no topo; fechar sem salvar volta pra que estava
document.querySelectorAll("input[name='corPerfil']").forEach(function (opcao) {
    opcao.onchange = () => pintarBanner(opcao.value);
});

pegar("botaoEditar").onclick = function () {
    const bloco = pegar("blocoEdicao");

    bloco.classList.toggle("escondido");

    if (bloco.classList.contains("escondido")) {
        pintarBanner(corSalva);
    }

    if (!bloco.classList.contains("escondido")) {
        bloco.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
        return `<span class="tag tagFerramenta"><mo-simbolo nome="${ferramenta.categoria === "Engine" ? "controle" : "pacote"}"></mo-simbolo>${escapar(ferramenta.nome)}</span>`;
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
                        <button type="button" class="botaoPerfil ${minhasFerramentas.has(f.id) ? "ativo" : ""}" data-id="${f.id}">
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
        return `<a class="tag tagLink" href="${escapar(link.url)}" target="_blank" rel="noopener noreferrer">${escapar(NOMES_LINK[link.tipo] || link.tipo)} ↗</a>`;
    }, "");

    if (!souEu) return;

    listar("meusLinks", links, function (link) {
        return `<span class="tag">${escapar(NOMES_LINK[link.tipo] || link.tipo)}
            <button type="button" class="botaoRemoverTag" onclick="removerLink(${link.id})" aria-label="Remover link">×</button></span>`;
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

    const pessoas = await jogadores();

    listar("listaAvaliacoesPerfil", dados.avaliacoes, function (avaliacao) {
        return `
            <article class="cartao cartaoAvaliacao">
                <div class="cartaoTopo">
                    ${sprite(pessoas.get(avaliacao.avaliador.handle) || avaliacao.avaliador, 36)}
                    <div class="cartaoTitulo">
                        <h3>${escapar(avaliacao.avaliador.usuario)}</h3>
                        <span>em ${escapar(avaliacao.projeto.nome)}</span>
                    </div>
                    <is-numero class="notaAvaliacao">${numero(avaliacao.nota, 0)}</is-numero>
                </div>
                <div class="notasDetalhe">
                    <span>Comunicação <is-medidor valor="${avaliacao.notaComunicacao}" max="5" segmentos="5"></is-medidor></span>
                    <span>Prazo <is-medidor valor="${avaliacao.notaPrazo}" max="5" segmentos="5"></is-medidor></span>
                    <span>Qualidade <is-medidor valor="${avaliacao.notaQualidade}" max="5" segmentos="5"></is-medidor></span>
                </div>
                ${avaliacao.comentario ? `<p class="citacao">“${escapar(avaliacao.comentario)}”</p>` : ""}
            </article>
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
    pegar("progressoPerfil").setAttribute("valor", dados.perfilCompleto);

    // o que falta vira a lista de tarefas da missao
    escrever("faltandoPerfil", dados.faltando.map((chave) => `<li>${escapar(FALTANDO[chave] || chave)}</li>`).join(""));
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

    // cabecalho: o sprite sai do apelido, a cor da funcao mais forte
    const principal = funcaoPrincipal({ skills: skills });

    pegar("avatarPerfil").setAttribute("semente", dados.handle);
    corAutomatica = principal ? classe(principal.categoria) : "";
    corSalva = dados.corPerfil || "";
    pintarBanner(corSalva);
    escrever("nomePerfil", escapar(dados.usuario));
    escrever("handlePerfil", `@${escapar(dados.handle)}`);
    escrever("funcaoPerfil", principal
        ? `<mo-simbolo nome="${simboloDaClasse(principal.categoria)}"></mo-simbolo>${escapar(principal.nome)} · ${escapar(NIVEIS[principal.nivel])}`
        : "Sem função definida");
    escrever("bioPerfil", escapar(dados.bio) || "Sem bio ainda.");
    document.title = `${dados.usuario} · IndieSquad`;

    if (dados.dataCriacao) {
        escrever("membroDesde", `Membro desde ${new Date(dados.dataCriacao).getFullYear()}`);
    }

    escrever("totalProjetos", numeros.totalProjetos || 0);
    escrever("totalColaboracoes", numeros.colaboracoes || 0);
    escrever("taxaConclusao", `${numeros.taxaConclusao || 0}%`);

    if (pegar("notaPerfil")) {
        const reputacao = numeros.reputacao || { total: 0, media: 0 };

        // a reputacao vira os atributos da ficha: a media grande e os tres criterios em barra
        escrever("notaPerfil", reputacao.total > 0
            ? `
                <div class="atributoMedia">
                    <is-numero>${numero(reputacao.media)}</is-numero>
                    <span>de ${plural(reputacao.total, "avaliação", "avaliações")}</span>
                </div>
                <div class="atributosLista">
                    <div class="atributo"><span>Comunicação</span><is-medidor valor="${reputacao.mediaComunicacao}" max="5" segmentos="10"></is-medidor><strong>${numero(reputacao.mediaComunicacao)}</strong></div>
                    <div class="atributo"><span>Prazo</span><is-medidor valor="${reputacao.mediaPrazo}" max="5" segmentos="10"></is-medidor><strong>${numero(reputacao.mediaPrazo)}</strong></div>
                    <div class="atributo"><span>Qualidade</span><is-medidor valor="${reputacao.mediaQualidade}" max="5" segmentos="10"></is-medidor><strong>${numero(reputacao.mediaQualidade)}</strong></div>
                </div>
            `
            : `<p class="semAvaliacao">Sem avaliação ainda. A reputação aparece depois do primeiro projeto concluído junto com alguém.</p>`);
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
            return `<span class="tag">${escapar(linha)}</span>`;
        }, "");
    }

    // so eu mexo nas minhas funcoes; no perfil de outra pessoa e so leitura
    listar("skillsPerfil", skills, function (skill) {
        const remover = souEu
            ? `<button type="button" class="botaoRemoverTag" onclick="removerSkill(${skill.id})">×</button>`
            : "";

        return `
            <div class="linhaFuncao ${classe(skill.categoria)}">
                <span class="iconeClasse"><mo-simbolo nome="${simboloDaClasse(skill.categoria)}"></mo-simbolo></span>
                <div class="cartaoTitulo">
                    <h3>${escapar(skill.nome)}</h3>
                    <span>${escapar(skill.categoria || "")} · ${escapar(NIVEIS[skill.nivel])}</span>
                </div>
                <is-nivel valor="${skill.nivel}"></is-nivel>
                ${remover}
            </div>
        `;
    }, "Nenhuma função cadastrada ainda.");

    listar("projetosPerfil", projetos, function (projeto) {
        const papel = projeto.ehCriador ? `<span class="tag"><mo-simbolo nome="coroa"></mo-simbolo>Criador</span>` : `<span class="tag">Membro</span>`;

        return `
            <article class="linhaTabela cartaoClicavel" onclick="irPara('projeto.html?id=${projeto.id}')">
                <div class="cartaoTopo">
                    ${cartucho(projeto.nome, 44)}
                    <div class="cartaoTitulo">
                        <h3>${escapar(projeto.nome)}</h3>
                        <span>${[projeto.genero, projeto.engine].filter(Boolean).map(escapar).join(" · ") || "Sem ficha técnica"}</span>
                    </div>
                </div>
                ${papel}
                ${selo(projeto.status)}
                <span class="setaLinha">→</span>
            </article>
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
        document.querySelector(`input[name='corPerfil'][value='${corSalva}']`).checked = true;

        pegar("blocoSkills").classList.remove("escondido");
        pegar("blocoFerramentas").classList.remove("escondido");
        pegar("blocoLinks").classList.remove("escondido");
    } else {
        pegar("botaoEditar").classList.add("escondido");
        pegar("blocoEdicao").classList.add("escondido");

        pegar("blocoSkills").classList.add("escondido");
        pegar("blocoFerramentas").classList.add("escondido");
        pegar("blocoLinks").classList.add("escondido");
        pegar("linkCandidaturas").classList.add("escondido");

        // perfil de outra pessoa: o "Meu perfil" do menu nao fica aceso
        document.querySelectorAll(".menuApp .mo-nav-item.ativo").forEach((item) => {
            item.classList.remove("ativo");
            item.removeAttribute("aria-current");
            item.querySelector(".mo-pilula")?.remove();
        });
        pegar("barraPerfilCompleto").classList.add("escondido");
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
        corPerfil: document.querySelector("input[name='corPerfil']:checked").value || null,
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
