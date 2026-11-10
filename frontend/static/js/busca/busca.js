
protegerPagina();

let abaAtiva = "profissionais";
let categoriaEscolhida = "Todos";
let skillEscolhida = "Todos";
let skillsDoBanco = [];



// as colunas da tabela de cada aba
const TOPOS = {
    profissionais: ["Jogador", "Função", "Reputação", "Tempo", "Histórico", ""],
    projetos: ["Projeto", "Ficha", "Parceria", "Equipe", "Vagas", ""],
};

function desenharTopo() {
    escrever("topoResultados", TOPOS[abaAtiva].map((nome) => `<span>${nome}</span>`).join(""));
    pegar("tabelaResultados").dataset.aba = abaAtiva;
}


function cardPessoa(pessoa) {
    const principal = funcaoPrincipal(pessoa);
    const outras = pessoa.skills.filter((skill) => skill !== principal);

    const reputacao = pessoa.reputacao.total > 0
        ? `${numero(pessoa.reputacao.media)}<small>${plural(pessoa.reputacao.total, "avaliação", "avaliações")}</small>`
        : `—<small>sem nota</small>`;

    const tempo = pessoa.disponibilidadeHoras
        ? `${pessoa.disponibilidadeHoras}h<small>por semana</small>`
        : `—<small>não disse</small>`;

    const historico = `${pessoa.colaboracoes + pessoa.projetosCriados}<small>${pessoa.colaboracoes + pessoa.projetosCriados === 1 ? "projeto" : "projetos"}</small>`;

    return `
        <article class="linhaTabela cartaoClicavel ${principal ? classe(principal.categoria) : ""}" onclick="irPara('perfil.html?handle=${encodeURIComponent(pessoa.handle)}')">
            <div class="cartaoTopo">
                ${sprite(pessoa, 45)}
                <div class="cartaoTitulo">
                    <h3>${escapar(pessoa.nome)}</h3>
                    <span>@${escapar(pessoa.handle)}</span>
                </div>
            </div>

            <div class="celulaFuncao">
                ${principal
                    ? `${tagFuncao(principal)}${outras.length ? `<small>+ ${outras.map((skill) => escapar(skill.nome)).join(", ")}</small>` : ""}`
                    : `<small>Sem função definida</small>`}
            </div>

            <span class="celulaMono">${reputacao}</span>
            <span class="celulaMono">${tempo}</span>
            <span class="celulaMono">${historico}</span>
            <span class="setaLinha">→</span>
        </article>
    `;
}

function cardProjeto(projeto) {
    const parceria = TIPOS_PARCERIA[projeto.tipoParceria] || projeto.tipoParceria;
    const ficha = [projeto.genero, projeto.engine].filter(Boolean).map(escapar);

    return `
        <article class="linhaTabela cartaoClicavel" onclick="irPara('projeto.html?id=${projeto.id}')">
            <div class="cartaoTopo">
                ${cartucho(projeto.nome, 55)}
                <div class="cartaoTitulo">
                    <h3>${escapar(projeto.nome)}</h3>
                    <span>por ${escapar(projeto.criador.usuario)}</span>
                    ${selo(projeto.status)}
                </div>
            </div>

            <span class="celulaMono">${ficha[0] || "—"}<small>${ficha[1] || "sem engine"}</small></span>
            <span class="celulaMono">${escapar(parceria || "—")}</span>
            <span class="celulaMono">${projeto.totalMembros}<small>na equipe</small></span>
            <span class="celulaMono ${projeto.vagasAbertas > 0 ? "dadoRealce" : ""}">${projeto.vagasAbertas}<small>abertas</small></span>
            <span class="setaLinha">→</span>
        </article>
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

        desenharTopo();
        escrever("contagemResultados", pessoas.length);
        listar("listaResultados", pessoas, cardPessoa, "Ninguém com esse perfil ainda. Tenta outra função.");
    } else {
        const projetos = await pedir(`/busca/projetos${filtros({ q: termo })}`);
        if (!projetos) return;

        desenharTopo();
        escrever("contagemResultados", projetos.length);
        listar("listaResultados", projetos, cardProjeto, "Nenhum projeto com esse nome.");
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


function chip(texto, ativo, acao, categoria) {
    // a categoria vira a classe: o chip ganha a cor e o simbolo dela
    const comClasse = acao === "categoria" && texto !== "Todos";
    const simbolo = acao === "categoria" ? `<mo-simbolo nome="${comClasse ? simboloDaClasse(texto) : "mosaico"}"></mo-simbolo>` : "";

    return `<button type="button" class="botaoFiltro ${classe(categoria || texto)} ${ativo ? "ativo" : ""}" data-valor="${escapar(texto)}" data-acao="${acao}">${simbolo}${escapar(texto)}</button>`;
}

function desenharFiltros() {
    const categorias = ["Todos", ...new Set(skillsDoBanco.map((skill) => skill.categoria))];

    escrever("filtrosCategorias", categorias.map(function (categoria) {
        return chip(categoria, categoria === categoriaEscolhida, "categoria");
    }).join(""));

    const daCategoria = skillsDoBanco.filter((skill) => skill.categoria === categoriaEscolhida);

    pegar("filtrosSkills").classList.toggle("escondido", daCategoria.length === 0);

    escrever("filtrosSkills", ["Todos", ...daCategoria.map((skill) => skill.nome)].map(function (nome) {
        return chip(nome, nome === skillEscolhida, "skill", categoriaEscolhida);
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


// a landing manda a categoria na url, e a busca do cabecalho manda o termo,
// pra pessoa cair na busca ja filtrada
function categoriaDoEndereco() {
    const pedida = parametro("categoria");
    const termo = parametro("q");

    if (pedida) categoriaEscolhida = pedida;
    if (termo) pegar("campoBusca").value = termo;
}


categoriaDoEndereco();
carregarSkills();
buscar();
