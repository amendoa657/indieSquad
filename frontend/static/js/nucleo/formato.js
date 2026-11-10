// textos, numeros e datas do jeito que a tela mostra

function corDoStatus(status) {
    if (status === "aceita") return "statusAceita";
    if (status === "recusada") return "statusRecusada";
    return "statusPendente";
}

function plural(quantidade, singular, muitos) {
    return `${quantidade} ${quantidade === 1 ? singular : muitos}`;
}

function dataBonita(data) {
    if (!data) {
        return "";
    }

    return new Date(data).toLocaleDateString("pt-BR");
}


const NOMES_LINK = {
    itchio: "itch.io",
    github: "GitHub",
    artstation: "ArtStation",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    site: "Site",
    outro: "Link",
};

const TIPOS_PARCERIA = {
    portfolio: "Portfólio",
    revenueShare: "Divisão de lucro",
    remunerado: "Remunerado",
};

const OBJETIVOS = {
    montarEquipe: "Montando equipe",
    entrarProjeto: "Procurando projeto",
    ambos: "Aberto aos dois",
};

// o banco guarda status sem acento, quem poe o acento e a tela
const ROTULOS = {
    ativo: "Ativo",
    pausado: "Pausado",
    concluido: "Concluído",
    cancelado: "Cancelado",
    aberta: "Aberta",
    preenchida: "Preenchida",
    fechada: "Fechada",
    pendente: "Pendente",
    aceita: "Aceita",
    recusada: "Recusada",
};

function rotulo(valor) {
    return ROTULOS[valor] || valor || "";
}

// numero do jeito que se escreve em portugues: 4,5 e nao 4.5
function numero(valor, casas = 1) {
    return Number(valor).toLocaleString("pt-BR", {
        minimumFractionDigits: casas,
        maximumFractionDigits: casas,
    });
}


function selo(status) {
    return `<span class="selo selo-${escapar(status)}">${escapar(rotulo(status))}</span>`;
}
