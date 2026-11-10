// as funcoes (skills) e a classe de cada uma

const NIVEIS = {
    1: "Iniciante",
    2: "Intermediário",
    3: "Avançado",
    4: "Especialista",
};


// cada area do catalogo e uma classe, como num RPG: cor e simbolo proprios
const CLASSES = {
    "Arte": { id: "arte", simbolo: "pincel" },
    "Áudio": { id: "audio", simbolo: "nota" },
    "Design": { id: "design", simbolo: "esquadro" },
    "Produção": { id: "producao", simbolo: "claquete" },
    "Programação": { id: "programacao", simbolo: "codigo" },
};

function classe(categoria) {
    return CLASSES[categoria] ? `classe-${CLASSES[categoria].id}` : "";
}

function simboloDaClasse(categoria) {
    return CLASSES[categoria] ? CLASSES[categoria].simbolo : "controle";
}

// a funcao que a pessoa leva mais longe decide a cor dela
function funcaoPrincipal(pessoa) {
    if (!pessoa || !pessoa.skills || pessoa.skills.length === 0) return null;

    return pessoa.skills.reduce((maior, skill) => (skill.nivel > maior.nivel ? skill : maior));
}


// funcao com a cor da classe e o nivel em quatro casinhas
function tagFuncao(skill, comNivel = true) {
    const nivel = comNivel && skill.nivel ? `<is-nivel valor="${skill.nivel}" title="${escapar(NIVEIS[skill.nivel])}"></is-nivel>` : "";

    return `<span class="tag tagClasse ${classe(skill.categoria)}">${escapar(skill.nome)}${nivel}</span>`;
}
