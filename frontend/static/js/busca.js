
protegerPagina();

let abaAtiva = "profissionais";
let skillEscolhida = "Todos";
let skillsDoBanco = [];



function cardPessoa(pessoa) {
    const funcao = pessoa.skills.length > 0 ? pessoa.skills[0].nome : "Sem função definida";
    const nota = pessoa.reputacao.total > 0
        ? `<span class="metricaResultado">${ICONES.estrela} ${pessoa.reputacao.media} (${pessoa.reputacao.total})</span>`
        : "";
    const horas = pessoa.disponibilidadeHoras
        ? `<span class="metricaResultado">${ICONES.relogio} ${pessoa.disponibilidadeHoras}h/semana</span>`
        : "";

    return `
        <div class="cardResultado cardClicavel" onclick="irPara('perfil.html?handle=${encodeURIComponent(pessoa.handle)}')">
            <div class="topoCardResultado">
                <div>
                    <h2>${escapar(pessoa.nome)}</h2>
                    <p class="funcaoResultado">${escapar(funcao)}</p>
                </div>
            </div>
            <div class="metricasResultado">
                ${nota}
                <span class="metricaResultado">${ICONES.grafico} ${pessoa.taxaConclusao}% Conclusão</span>
                <span class="metricaResultado">${ICONES.pasta} ${pessoa.projetosCriados} Projeto(s)</span>
                ${horas}
            </div>
            <div class="tagsResultado">
                ${pessoa.skills.map((skill) => `<span class="tagSkill">${escapar(skill.nome)} · ${escapar(NIVEIS[skill.nivel])}</span>`).join("")}
            </div>
        </div>
    `;
}

function cardProjeto(projeto) {
    const parceria = TIPOS_PARCERIA[projeto.tipoParceria] || projeto.tipoParceria;

    const detalhes = [projeto.genero, projeto.engine, parceria]
        .filter((item) => item)
        .map((item) => `<span class="tagSkill">${escapar(item)}</span>`)
        .join("");

    return `
        <div class="cardResultado cardClicavel" onclick="irPara('projeto.html?id=${projeto.id}')">
            <div class="topoCardResultado">
                <h2>${escapar(projeto.nome)}</h2>
                <span class="statusResultado">${escapar(projeto.status)}</span>
            </div>
            <p class="descricaoResultado">${escapar(projeto.descricao) || "Sem descrição"}</p>
            <div class="metricasResultado">
                <span class="metricaResultado">${ICONES.pessoas} ${projeto.totalMembros} na equipe</span>
                <span class="metricaResultado">${ICONES.pasta} ${projeto.vagasAbertas} vaga(s) aberta(s)</span>
            </div>
            <div class="tagsResultado">${detalhes}</div>
        </div>
    `;
}



async function buscar() {
    const termo = pegar("campoBusca").value.trim();

    // Os dois filtros agora acontecem no servidor. Antes o front baixava todo
    // mundo e filtrava no navegador.
    if (abaAtiva === "profissionais") {
        const pessoas = await pedir(`/busca/profissionais${filtros({ skill: skillEscolhida, q: termo })}`);
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
    // Os filtros de skill só fazem sentido pra profissionais.
    pegar("filtrosSkills").style.display = abaAtiva === "profissionais" ? "flex" : "none";
    buscar();
}

function filtrarPor(nomeDaSkill) {
    skillEscolhida = nomeDaSkill;
    desenharFiltros();
    buscar();
}

function desenharFiltros() {
    escrever("filtrosSkills", skillsDoBanco.map(function (nome) {
        const classeAtiva = nome === skillEscolhida ? "ativo" : "";

        // O nome vai no atributo data, não dentro do onclick: assim uma skill
        // com apóstrofo no nome não quebra o botão.
        return `<button type="button" class="botaoFiltro ${classeAtiva}" data-skill="${escapar(nome)}">${escapar(nome)}</button>`;
    }).join(""));

    document.querySelectorAll(".botaoFiltro").forEach(function (botao) {
        botao.onclick = function () {
            filtrarPor(botao.dataset.skill);
        };
    });
}

pegar("abaProfissionais").onclick = () => abrirAba("profissionais");
pegar("abaProjetos").onclick = () => abrirAba("projetos");
pegar("campoBusca").oninput = buscar;   // busca a cada letra digitada



async function carregarSkills() {
    const skills = await pedir("/skills");
    if (!skills) return;

    skillsDoBanco = ["Todos", ...skills.map((skill) => skill.nome)];
    desenharFiltros();
}

carregarSkills();
buscar();
