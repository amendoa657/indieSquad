const campoBusca = document.getElementById("campoBusca");
const tabProjetos = document.getElementById("tabProjetos");
const tabProfissionais = document.getElementById("tabProfissionais");
const filtrosSkills = document.getElementById("filtrosSkills");
const listaResultados = document.getElementById("listaResultados");

let abaAtual = "profissionais";
let skillSelecionada = "Todos";

async function carregarFiltros() {
    try {
        const resposta = await fetch("http://localhost:5000/skills");
        const skills = await resposta.json();

        const todas = ["Todos", ...skills.map((skill) => skill.nome)];

        filtrosSkills.innerHTML = "";
        todas.forEach((nome) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "chipFiltro" + (nome === skillSelecionada ? " ativo" : "");
            chip.textContent = nome;

            chip.addEventListener("click", () => {
                skillSelecionada = nome;
                document.querySelectorAll(".chipFiltro").forEach((c) => c.classList.remove("ativo"));
                chip.classList.add("ativo");
                buscar();
            });

            filtrosSkills.appendChild(chip);
        });
    } catch (erro) {
        console.error(erro);
    }
}

function renderizarProfissionais(lista) {
    listaResultados.innerHTML = "";

    if (lista.length === 0) {
        listaResultados.innerHTML = '<p class="mensagemVazia">Nenhum profissional encontrado.</p>';
        return;
    }

    lista.forEach((pessoa) => {
        const funcao = pessoa.skills.length > 0 ? pessoa.skills[0] : "Sem função definida";

        const card = document.createElement("div");
        card.className = "cardResultado";
        card.innerHTML = `
            <div class="cardResultadoTopo">
                <div>
                    <h2>${pessoa.nome}</h2>
                    <p class="funcaoResultado">${funcao}</p>
                </div>
            </div>
            <div class="metricasResultado">
                <span class="metricaResultado">
                    <svg viewBox="0 0 24 24" width="13" height="13"><polyline points="3 17 9 11 13 15 21 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                    ${pessoa.taxaConclusao}% Conclusão
                </span>
                <span class="metricaResultado">
                    <svg viewBox="0 0 24 24" width="13" height="13"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                    ${pessoa.projetosCriados} Projeto(s)
                </span>
            </div>
            <div class="tagsResultado">
                ${pessoa.skills.map((skill) => `<span class="tagSkill">${skill}</span>`).join("")}
            </div>
        `;
        listaResultados.appendChild(card);
    });
}

function renderizarProjetos(lista) {
    listaResultados.innerHTML = "";

    if (lista.length === 0) {
        listaResultados.innerHTML = '<p class="mensagemVazia">Nenhum projeto encontrado.</p>';
        return;
    }

    lista.forEach((projeto) => {
        const card = document.createElement("div");
        card.className = "cardResultado cardClicavel";
        card.innerHTML = `
            <div class="cardResultadoTopo">
                <h2>${projeto.nome}</h2>
                <span class="statusProjetoBusca">${projeto.status}</span>
            </div>
            <p class="cardResultadoStats">${projeto.descricao || "Sem descrição"}</p>
            <div class="tagsResultado">
                <span class="tagSkill">${projeto.vagasAbertas} vaga(s) aberta(s)</span>
            </div>
        `;
        card.addEventListener("click", () => {
            window.location.href = `projeto.html?id=${projeto.id}`;
        });
        listaResultados.appendChild(card);
    });
}

async function buscar() {
    const termo = campoBusca.value.trim();

    try {
        if (abaAtual === "profissionais") {
            const params = new URLSearchParams();
            if (skillSelecionada !== "Todos") params.set("skill", skillSelecionada);

            const resposta = await fetch(`http://localhost:5000/busca/profissionais?${params}`);
            const dados = await resposta.json();

            const filtrado = termo
                ? dados.filter((pessoa) => pessoa.nome.toLowerCase().includes(termo.toLowerCase()))
                : dados;

            renderizarProfissionais(filtrado);
        } else {
            const params = new URLSearchParams();
            if (termo) params.set("q", termo);

            const resposta = await fetch(`http://localhost:5000/busca/projetos?${params}`);
            const dados = await resposta.json();

            renderizarProjetos(dados);
        }
    } catch (erro) {
        console.error(erro);
        listaResultados.innerHTML = '<p class="mensagemVazia">Não foi possível conectar ao servidor.</p>';
    }
}

tabProjetos.addEventListener("click", () => {
    abaAtual = "projetos";
    tabProjetos.classList.add("ativo");
    tabProfissionais.classList.remove("ativo");
    filtrosSkills.style.display = "none";
    buscar();
});

tabProfissionais.addEventListener("click", () => {
    abaAtual = "profissionais";
    tabProfissionais.classList.add("ativo");
    tabProjetos.classList.remove("ativo");
    filtrosSkills.style.display = "flex";
    buscar();
});

campoBusca.addEventListener("input", () => buscar());

carregarFiltros();
buscar();
