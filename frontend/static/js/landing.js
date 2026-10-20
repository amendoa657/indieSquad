// a abertura mostra quem ja esta no sistema, no formato de uma lista de creditos

const LIMITE_ELENCO = 7;


// a funcao que a pessoa leva mais longe e a que melhor representa ela na lista
function funcaoPrincipal(pessoa) {
    if (!pessoa.skills || pessoa.skills.length === 0) return null;

    return pessoa.skills.reduce((maior, skill) => (skill.nivel > maior.nivel ? skill : maior)).nome;
}


function primeiroESobrenome(nome) {
    const partes = nome.trim().split(/\s+/);

    if (partes.length === 1) return partes[0];

    return `${partes[0]} ${partes[partes.length - 1]}`;
}


async function carregarElenco() {
    const pessoas = await pedir("/busca/profissionais");
    if (!pessoas) return;

    const comFuncao = pessoas.filter(funcaoPrincipal).slice(0, LIMITE_ELENCO);

    listar("elencoLista", comFuncao, function (pessoa) {
        return `
            <li class="elencoItem">
                <span class="elencoFuncao">${escapar(funcaoPrincipal(pessoa))}</span>
                <span class="elencoNome">${escapar(primeiroESobrenome(pessoa.nome))}</span>
            </li>
        `;
    }, "Ninguém por aqui ainda. Seja o primeiro.");
}


async function carregarEstatisticas() {
    const dados = await pedir("/estatisticas");
    if (!dados) return;

    escrever("elencoRodape",
        `${plural(dados.profissionais, "pessoa", "pessoas")} · ` +
        `${plural(dados.projetos, "projeto", "projetos")} · ` +
        `${plural(dados.avaliacoes, "avaliação", "avaliações")}`);
}


carregarElenco();
carregarEstatisticas();


// as categorias vem do catalogo do banco e levam pra busca ja filtrada
const ICONE_CATEGORIA = {
    "Programação": `<path d="M8.5 7.5 3 12l5.5 4.5M15.5 7.5 21 12l-5.5 4.5M13.5 4l-3 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>`,
    "Arte": `<path d="M4 20.5 15 9.5l-2.5-2.5L1.5 18v2.5z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M14 4.5 19.5 10M16.5 2 22 7.5" fill="none" stroke="currentColor" stroke-width="1.8"/>`,
    "Áudio": `<path d="M4 15V9h3l5-4v14l-5-4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="miter"/><path d="M16 9.5a4 4 0 0 1 0 5M19 7a7.5 7.5 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.8"/>`,
    "Design": `<rect x="3" y="3" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="3" width="8" height="18" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="13" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.8"/>`,
    "Produção": `<rect x="4" y="3" width="16" height="18" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 9h8M8 13h8M8 17h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/>`,
};


async function carregarFuncoes() {
    const skills = await pedir("/skills");
    if (!skills) return;

    const porCategoria = new Map();

    skills.forEach(function (skill) {
        porCategoria.set(skill.categoria, (porCategoria.get(skill.categoria) || 0) + 1);
    });

    const categorias = [...porCategoria.entries()].sort((a, b) => b[1] - a[1]);

    listar("funcoes", categorias, function ([categoria, total]) {
        const desenho = ICONE_CATEGORIA[categoria] || "";

        return `
            <li>
                <a href="busca.html?categoria=${encodeURIComponent(categoria)}">
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">${desenho}</svg>
                    <span class="funcaoNome">${escapar(categoria)}</span>
                    <span class="funcaoTotal">${total}</span>
                </a>
            </li>
        `;
    }, "O catálogo de funções ainda não foi carregado.");
}


carregarFuncoes();
