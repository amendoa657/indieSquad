
iniciarPagina();

let aba = "profissionais";   
let skill = "Todos";      
let skillsDoBanco = [];      



function cardPessoa(pessoa) {
    const funcao = pessoa.skills.length > 0 ? pessoa.skills[0] : "Sem função definida";

    return `
        <div class="cardResultado">
            <div class="cardResultadoTopo">
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
            <div class="cardResultadoTopo">
                <h2>${projeto.nome}</h2>
                <span class="statusProjetoBusca">${projeto.status}</span>
            </div>
            <p class="cardResultadoStats">${projeto.descricao || "Sem descrição"}</p>
            <div class="tagsResultado">
                <span class="tagSkill">${projeto.vagasAbertas} vaga(s) aberta(s)</span>
            </div>
        </div>
    `;
}



async function buscar() {
    const termo = pegar("campoBusca").value.trim();

    if (aba === "profissionais") {
        // Se um filtro de skill estiver aceso, manda ele junto no endereço.
        const filtro = skill === "Todos" ? "" : `?skill=${skill}`;
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
    aba = novaAba;
    pegar("tabProfissionais").classList.toggle("ativo", aba === "profissionais");
    pegar("tabProjetos").classList.toggle("ativo", aba === "projetos");
    // Os filtros de skill só fazem sentido pra profissionais.
    pegar("filtrosSkills").style.display = aba === "profissionais" ? "flex" : "none";
    buscar();
}

function filtrarPor(nomeDaSkill) {
    skill = nomeDaSkill;
    desenharFiltros();
    buscar();
}

function desenharFiltros() {
    escrever("filtrosSkills", skillsDoBanco.map(function (nome) {
        const aceso = nome === skill ? "ativo" : "";
        return `<button type="button" class="chipFiltro ${aceso}" onclick="filtrarPor('${nome}')">${nome}</button>`;
    }).join(""));
}

pegar("tabProfissionais").onclick = () => abrirAba("profissionais");
pegar("tabProjetos").onclick = () => abrirAba("projetos");
pegar("campoBusca").oninput = buscar;   // busca a cada letra digitada



async function carregarSkills() {
    const skills = await pedir("/skills");
    if (!skills) return;

    skillsDoBanco = ["Todos", ...skills.map((s) => s.nome)];
    desenharFiltros();
}

carregarSkills();
buscar();
