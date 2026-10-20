
protegerPagina();

let abaAtiva = "profissionais";
let categoriaEscolhida = "Todos";
let skillEscolhida = "Todos";
let skillsDoBanco = [];



function cardPessoa(pessoa) {
    const funcao = pessoa.skills.length > 0 ? pessoa.skills[0].nome : "Sem função definida";

    // metrica sem dado atras nao aparece
    const metricas = [];

    if (pessoa.reputacao.total > 0) {
        metricas.push(`${icone("estrela")} ${numero(pessoa.reputacao.media)} · ${plural(pessoa.reputacao.total, "avaliação", "avaliações")}`);
    }

    if (pessoa.projetosCriados > 0) {
        metricas.push(`${icone("pasta")} ${plural(pessoa.projetosCriados, "projeto", "projetos")}`);
        metricas.push(`${icone("grafico")} ${pessoa.taxaConclusao}% concluídos`);
    }

    if (pessoa.colaboracoes > 0) {
        metricas.push(`${icone("pessoas")} ${plural(pessoa.colaboracoes, "colaboração", "colaborações")}`);
    }

    if (pessoa.disponibilidadeHoras) {
        metricas.push(`${icone("relogio")} ${pessoa.disponibilidadeHoras}h por semana`);
    }

    const corpoMetricas = metricas.length > 0
        ? `<div class="metricasResultado">${metricas.map((m) => `<span class="metricaResultado">${m}</span>`).join("")}</div>`
        : `<p class="semMetrica">Perfil novo por aqui</p>`;

    return `
        <div class="mo-cartao cardResultado cardClicavel" onclick="irPara('perfil.html?handle=${encodeURIComponent(pessoa.handle)}')">
            <div class="topoCardResultado">
                <div>
                    <h2>${escapar(pessoa.nome)}</h2>
                    <p class="funcaoResultado">${escapar(funcao)}</p>
                </div>
            </div>
            ${corpoMetricas}
            <div class="tagsResultado">
                ${pessoa.skills.map((skill) => `<span class="mo-chip tagSkill">${escapar(skill.nome)} · ${escapar(NIVEIS[skill.nivel])}</span>`).join("")}
            </div>
        </div>
    `;
}

function cardProjeto(projeto) {
    const parceria = TIPOS_PARCERIA[projeto.tipoParceria] || projeto.tipoParceria;

    const detalhes = [projeto.genero, projeto.engine, parceria]
        .filter((item) => item)
        .map((item) => `<span class="mo-chip tagSkill">${escapar(item)}</span>`)
        .join("");

    return `
        <div class="mo-cartao cardResultado cardClicavel" onclick="irPara('projeto.html?id=${projeto.id}')">
            <div class="topoCardResultado">
                <h2>${escapar(projeto.nome)}</h2>
                <span class="mo-selo statusResultado">${escapar(rotulo(projeto.status))}</span>
            </div>
            <p class="descricaoResultado">${escapar(projeto.descricao) || "Sem descrição"}</p>
            <div class="metricasResultado">
                <span class="metricaResultado">${icone("pessoas")} ${plural(projeto.totalMembros, "na equipe", "na equipe")}</span>
                <span class="metricaResultado">${icone("pasta")} ${plural(projeto.vagasAbertas, "vaga aberta", "vagas abertas")}</span>
            </div>
            <div class="tagsResultado">${detalhes}</div>
        </div>
    `;
}



async function buscar() {
    const termo = pegar("campoBusca").value.trim();

    // os filtros acontecem no servidor
    if (abaAtiva === "profissionais") {
        const pessoas = await pedir(`/busca/profissionais${filtros({
            skill: skillEscolhida,
            categoria: categoriaEscolhida,
            q: termo,
        })}`);
        if (!pessoas) return;

        listar("listaResultados", pessoas, cardPessoa, "Nenhum profissional encontrado.");
    } else {
        const projetos = await pedir(`/busca/projetos${filtros({ q: termo })}`);
        if (!projetos) return;

        listar("listaResultados", projetos, cardProjeto, "Nenhum projeto encontrado.");
    }
}



function abrirAba(novaAba) {
    abaAtiva = novaAba;
    pegar("abaProfissionais").classList.toggle("ativo", abaAtiva === "profissionais");
    pegar("abaProjetos").classList.toggle("ativo", abaAtiva === "projetos");

    // os filtros de funcao so fazem sentido pra profissionais
    const mostrar = abaAtiva === "profissionais";
    pegar("filtrosCategorias").classList.toggle("escondido", !mostrar);
    pegar("filtrosSkills").classList.toggle("escondido", !mostrar || categoriaEscolhida === "Todos");

    buscar();
}


// o filtro tem dois niveis: categoria primeiro, funcao depois
function filtrarPorCategoria(categoria) {
    categoriaEscolhida = categoria;
    skillEscolhida = "Todos";
    desenharFiltros();
    buscar();
}

function filtrarPorSkill(nomeDaSkill) {
    skillEscolhida = nomeDaSkill;
    desenharFiltros();
    buscar();
}


function chip(texto, ativo, acao) {
    return `<button type="button" class="mo-chip botaoFiltro ${ativo ? "ativo" : ""}" data-valor="${escapar(texto)}" data-acao="${acao}">${escapar(texto)}</button>`;
}

function desenharFiltros() {
    const categorias = ["Todos", ...new Set(skillsDoBanco.map((skill) => skill.categoria))];

    escrever("filtrosCategorias", categorias.map(function (categoria) {
        return chip(categoria, categoria === categoriaEscolhida, "categoria");
    }).join(""));

    const daCategoria = skillsDoBanco.filter((skill) => skill.categoria === categoriaEscolhida);

    pegar("filtrosSkills").classList.toggle("escondido", daCategoria.length === 0);

    escrever("filtrosSkills", ["Todos", ...daCategoria.map((skill) => skill.nome)].map(function (nome) {
        return chip(nome, nome === skillEscolhida, "skill");
    }).join(""));

    // o valor vai no atributo: nome com apostrofo quebraria o onclick
    document.querySelectorAll(".botaoFiltro").forEach(function (botao) {
        botao.onclick = function () {
            if (botao.dataset.acao === "categoria") {
                filtrarPorCategoria(botao.dataset.valor);
            } else {
                filtrarPorSkill(botao.dataset.valor);
            }
        };
    });
}

pegar("abaProfissionais").onclick = () => abrirAba("profissionais");
pegar("abaProjetos").onclick = () => abrirAba("projetos");
pegar("campoBusca").oninput = buscar;   // busca a cada letra digitada



async function carregarSkills() {
    const skills = await pedir("/skills");
    if (!skills) return;

    skillsDoBanco = skills;
    desenharFiltros();
}


// a landing manda a categoria na url, pra pessoa cair na busca ja filtrada
function categoriaDoEndereco() {
    const pedida = new URLSearchParams(location.search).get("categoria");
    if (!pedida) return;

    categoriaEscolhida = pedida;
}


categoriaDoEndereco();
carregarSkills();
buscar();
