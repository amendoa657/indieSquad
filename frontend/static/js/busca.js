
protegerPagina();

let abaAtiva = "profissionais";
let categoriaEscolhida = "Todos";
let skillEscolhida = "Todos";
let skillsDoBanco = [];



function cardPessoa(pessoa) {
    const principal = funcaoPrincipal(pessoa);

    // metrica sem dado atras nao aparece
    const metricas = [];

    if (pessoa.reputacao.total > 0) {
        metricas.push(`<mo-simbolo nome="estrela"></mo-simbolo>${numero(pessoa.reputacao.media)} <small>(${pessoa.reputacao.total})</small>`);
    }

    if (pessoa.disponibilidadeHoras) {
        metricas.push(`<mo-simbolo nome="relogio"></mo-simbolo>${pessoa.disponibilidadeHoras}h/sem`);
    }

    if (pessoa.colaboracoes > 0) {
        metricas.push(`<mo-simbolo nome="usuario"></mo-simbolo>${plural(pessoa.colaboracoes, "colab.", "colabs.")}`);
    }

    if (pessoa.projetosCriados > 0) {
        metricas.push(`<mo-simbolo nome="bandeira"></mo-simbolo>${pessoa.taxaConclusao}% concluídos`);
    }

    const corpoMetricas = metricas.length > 0
        ? `<div class="statusPessoa">${metricas.map((m) => `<span>${m}</span>`).join("")}</div>`
        : `<p class="semMetrica">Perfil novo por aqui</p>`;

    return `
        <article class="cartao cartaoClicavel mira cartaoPessoa ${principal ? classe(principal.categoria) : ""}" onclick="irPara('perfil.html?handle=${encodeURIComponent(pessoa.handle)}')">
            <div class="cartaoTopo">
                ${sprite(pessoa, 54)}
                <div class="cartaoTitulo">
                    <h3>${escapar(pessoa.nome)}</h3>
                    <p class="classePessoa">${principal ? `${escapar(principal.nome)} · ${escapar(NIVEIS[principal.nivel])}` : "Sem função definida"}</p>
                    <span>@${escapar(pessoa.handle)}</span>
                </div>
            </div>
            ${corpoMetricas}
            <div class="tags">
                ${pessoa.skills.map((skill) => tagFuncao(skill)).join("")}
            </div>
        </article>
    `;
}

function cardProjeto(projeto) {
    const parceria = TIPOS_PARCERIA[projeto.tipoParceria] || projeto.tipoParceria;

    const detalhes = [projeto.genero, projeto.engine, parceria]
        .filter((item) => item)
        .map((item) => `<span class="tag">${escapar(item)}</span>`)
        .join("");

    return `
        <article class="cartao cartaoClicavel mira cartaoProjeto" onclick="irPara('projeto.html?id=${projeto.id}')">
            <div class="cartaoTopo">
                ${cartucho(projeto.nome, 55)}
                <div class="cartaoTitulo">
                    <h3>${escapar(projeto.nome)}</h3>
                    <span>por ${escapar(projeto.criador.usuario)}</span>
                </div>
                ${selo(projeto.status)}
            </div>
            <p class="cartaoTexto">${escapar(projeto.descricao) || "Sem descrição"}</p>
            <div class="tags">${detalhes}</div>
            <div class="cartaoPe">
                <span class="dado"><mo-simbolo nome="usuario"></mo-simbolo>${plural(projeto.totalMembros, "na equipe", "na equipe")}</span>
                <span class="dado ${projeto.vagasAbertas > 0 ? "dadoRealce" : ""}"><mo-simbolo nome="pasta"></mo-simbolo>${plural(projeto.vagasAbertas, "vaga aberta", "vagas abertas")}</span>
            </div>
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

        escrever("contagemResultados", plural(pessoas.length, "pessoa encontrada", "pessoas encontradas"));
        listar("listaResultados", pessoas, cardPessoa, "Ninguém com esse perfil ainda. Tenta outra função.");
    } else {
        const projetos = await pedir(`/busca/projetos${filtros({ q: termo })}`);
        if (!projetos) return;

        escrever("contagemResultados", plural(projetos.length, "projeto encontrado", "projetos encontrados"));
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
    const simbolo = comClasse ? `<mo-simbolo nome="${simboloDaClasse(texto)}"></mo-simbolo>` : "";

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
