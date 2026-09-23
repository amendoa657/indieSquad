
protegerPagina();

let abaAtiva = "profissionais";   
let skillEscolhida = "Todos";      
let skillsDoBanco = [];      



function cardPessoa(pessoa) {
    const funcao = pessoa.skills.length > 0 ? pessoa.skills[0] : "Sem função definida";

    return `
        <div class="cardResultado">
            <div class="topoCardResultado">
                <div>
                    <h2>${pessoa.nome}</h2>
                    <p class="funcaoResultado">${funcao}</p>
                </div>
            </div>
            <div class="metricasResultado">
                <span class="metricaResultado">${ICONES.grafico} ${pessoa.taxaConclusao}% Conclusão</span>
                <span class="metricaResultado">${ICONES.pasta} ${pessoa.projetosCriados} Projeto(s)</span>
            </div>
            <div class="tagsResultado">
                ${pessoa.skills.map((nomeSkill) => `<span class="tagSkill">${nomeSkill}</span>`).join("")}
            </div>
        </div>
    `;
}

function cardProjeto(projeto) {
    return `
        <div class="cardResultado cardClicavel" onclick="irPara('projeto.html?id=${projeto.id}')">
            <div class="topoCardResultado">
                <h2>${projeto.nome}</h2>
                <span class="statusResultado">${projeto.status}</span>
            </div>
            <p class="descricaoResultado">${projeto.descricao || "Sem descrição"}</p>
            <div class="tagsResultado">
                <span class="tagSkill">${projeto.vagasAbertas} vaga(s) aberta(s)</span>
            </div>
        </div>
    `;
}



async function buscar() {
    const termo = pegar("campoBusca").value.trim();

    if (abaAtiva === "profissionais") {
        // Se tiver uma skill escolhida, manda ela junto no endereço.
        // O nome "skill" aqui é o que o backend espera, não pode mudar.
        const filtro = skillEscolhida === "Todos" ? "" : `?skill=${skillEscolhida}`;
        const pessoas = await pedir(`/busca/profissionais${filtro}`);
        if (!pessoas) return;

        // O filtro por nome é feito aqui mesmo, no navegador.
        const achados = pessoas.filter(function (pessoa) {
            return pessoa.nome.toLowerCase().includes(termo.toLowerCase());
        });

        listar("listaResultados", achados, cardPessoa, "Nenhum profissional encontrado.");
    } else {
        const projetos = await pedir(`/busca/projetos?q=${termo}`);
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
        return `<button type="button" class="botaoFiltro ${classeAtiva}" onclick="filtrarPor('${nome}')">${nome}</button>`;
    }).join(""));
}

pegar("abaProfissionais").onclick = () => abrirAba("profissionais");
pegar("abaProjetos").onclick = () => abrirAba("projetos");
pegar("campoBusca").oninput = buscar;   // busca a cada letra digitada



async function carregarSkills() {
    const skills = await pedir("/skills");
    if (!skills) return;

    skillsDoBanco = ["Todos", ...skills.map((s) => s.nome)];
    desenharFiltros();
}

carregarSkills();
buscar();
