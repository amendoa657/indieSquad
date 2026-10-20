
protegerPagina();

// onboarding de tres passos, depois do cadastro

const TOTAL_PASSOS = 3;
let passoAtual = 1;
let skillsDoBanco = [];
let ferramentasDoBanco = [];
const minhasFerramentas = new Set();


function desenharPassos() {
    const passos = [];

    for (let numero = 1; numero <= TOTAL_PASSOS; numero++) {
        const estado = numero === passoAtual ? "passoAtivo" : (numero < passoAtual ? "passoFeito" : "");
        passos.push(`<span class="marcadorPasso ${estado}" aria-label="passo ${numero}"></span>`);
    }

    escrever("passosOnboarding", passos.join(""));
}


function irParaPasso(numero) {
    passoAtual = numero;

    for (let i = 1; i <= TOTAL_PASSOS; i++) {
        pegar(`passo${i}`).classList.toggle("passoAtivo", i === numero);
    }

    desenharPassos();
    avisar("");
}


function pular() {
    irPara("dashboard.html");
}


// ---------- Passo 1: funcoes ----------

async function carregarSkills() {
    const skills = await pedir("/skills");
    if (!skills) return;

    skillsDoBanco = skills;

    pegar("campoSkill").innerHTML =
        `<option value="">Escolhe uma função...</option>` +
        skills.map((skill) => `<option value="${skill.id}">${escapar(skill.nome)}</option>`).join("");

    mostrarMinhasSkills();
}


async function mostrarMinhasSkills() {
    const skills = (await pedir(`/usuarios/${meuId()}/skills/`)) || [];

    listar("minhasSkills", skills, function (skill) {
        return `<span class="tag tagClasse ${classe(skill.categoria)}">${escapar(skill.nome)}<is-nivel valor="${skill.nivel}"></is-nivel>
            <button type="button" class="botaoRemoverTag" onclick="removerSkill(${skill.id})" aria-label="Remover">×</button></span>`;
    }, "");
}


async function adicionarSkill() {
    const idSkill = Number(pegar("campoSkill").value);

    if (!idSkill) {
        avisar("Escolhe uma função na lista.");
        return;
    }

    const resposta = await pedir(`/usuarios/${meuId()}/skills/`, "POST", {
        idSkill: idSkill,
        nivel: Number(pegar("campoNivel").value),
    });

    if (!resposta) return;

    pegar("campoSkill").value = "";
    mostrarMinhasSkills();
}


async function removerSkill(idSkill) {
    const resposta = await pedir(`/usuarios/${meuId()}/skills/${idSkill}`, "DELETE");
    if (!resposta) return;

    mostrarMinhasSkills();
}


// ---------- Passo 2: compromisso ----------

async function salvarCompromisso() {
    const horas = valor("campoHoras");

    const resposta = await pedir(`/usuarios/atualizar/${meuId()}`, "PUT", {
        bio: valor("campoBio"),
        disponibilidadeHoras: horas ? Number(horas) : null,
        aceitaPortfolio: pegar("campoPortfolio").checked,
        aceitaRevenueShare: pegar("campoRevenueShare").checked,
        aceitaRemunerado: pegar("campoRemunerado").checked,
    });

    if (!resposta) return;

    guardarLogin({ token: localStorage.getItem("token"), usuario: resposta });
    irParaPasso(3);
}


// ---------- Passo 3: ferramentas e links ----------

async function carregarFerramentas() {
    const ferramentas = await pedir("/ferramentas");
    if (!ferramentas) return;

    ferramentasDoBanco = ferramentas;

    const minhas = (await pedir(`/usuarios/${meuId()}/ferramentas`)) || [];
    minhas.forEach((ferramenta) => minhasFerramentas.add(ferramenta.id));

    const categorias = [...new Set(ferramentas.map((f) => f.categoria))];

    escrever("botoesFerramenta", categorias.map(function (categoria) {
        const daCategoria = ferramentas.filter((f) => f.categoria === categoria);

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

    document.querySelectorAll(".botaoPerfil").forEach(function (botao) {
        botao.onclick = () => alternarFerramenta(Number(botao.dataset.id), botao);
    });
}


async function alternarFerramenta(idFerramenta, botao) {
    if (minhasFerramentas.has(idFerramenta)) {
        const resposta = await pedir(`/usuarios/${meuId()}/ferramentas/${idFerramenta}`, "DELETE");
        if (!resposta) return;

        minhasFerramentas.delete(idFerramenta);
        botao.classList.remove("ativo");
        return;
    }

    const resposta = await pedir(`/usuarios/${meuId()}/ferramentas`, "POST", { idFerramenta: idFerramenta });
    if (!resposta) return;

    minhasFerramentas.add(idFerramenta);
    botao.classList.add("ativo");
}


async function mostrarMeusLinks() {
    const links = (await pedir(`/usuarios/${meuId()}/links`)) || [];

    listar("meusLinks", links, function (link) {
        return `<span class="tag">${escapar(NOMES_LINK[link.tipo] || link.tipo)}
            <button type="button" class="botaoRemoverTag" onclick="removerLink(${link.id})">×</button></span>`;
    }, "");
}


async function adicionarLink() {
    const url = valor("campoUrlLink");

    if (!url) {
        avisar("Cola o endereço do seu portfólio.");
        return;
    }

    const resposta = await pedir(`/usuarios/${meuId()}/links`, "POST", {
        tipo: pegar("campoTipoLink").value,
        url: url,
    });

    if (!resposta) return;

    pegar("campoUrlLink").value = "";
    mostrarMeusLinks();
}


async function removerLink(idLink) {
    const resposta = await pedir(`/links/${idLink}`, "DELETE");
    if (!resposta) return;

    mostrarMeusLinks();
}


function terminar() {
    irPara("dashboard.html");
}


desenharPassos();
carregarSkills();
carregarFerramentas();
mostrarMeusLinks();
