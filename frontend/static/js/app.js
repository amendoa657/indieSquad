// endereco do back-end
const API = "http://localhost:5000";


function pegar(id) {
    return document.getElementById(id);
}
function valor(id) {
    return pegar(id).value.trim();
}

function escrever(id, conteudo) {
    const alvo = pegar(id);

    if (alvo) {
        alvo.innerHTML = conteudo;
    }
}

// deixa um texto digitado por outra pessoa seguro pra entrar no HTML
function escapar(texto) {
    if (texto === null || texto === undefined) {
        return "";
    }

    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function irPara(pagina) {
    window.location.href = pagina;
}

function avisar(texto) {
    if (pegar("mensagemErro")) {
        escrever("mensagemErro", escapar(texto));
    } else if (texto) {
        alert(texto);
    }
}

function avisarSucesso(texto) {
    if (pegar("mensagemSucesso")) {
        escrever("mensagemSucesso", escapar(texto));
    }
}

function ligarOlhinho() {
    const botao = pegar("botaoOlho");

    if (!botao) {
        return;
    }

    botao.onclick = function () {
        const campo = pegar("senha");
        campo.type = campo.type === "password" ? "text" : "password";
    };
}

async function pedir(caminho, metodo = "GET", dados = null) {
    try {
        // o token vai em todo pedido
        const cabecalhos = { "Content-Type": "application/json" };
        const token = localStorage.getItem("token");

        if (token) {
            cabecalhos["Authorization"] = `Bearer ${token}`;
        }

        const resposta = await fetch(API + caminho, {
            method: metodo,
            headers: cabecalhos,
            body: dados ? JSON.stringify(dados) : null,
        });

        // traduz a resposta do servidor (texto) pra algo que o JS entende
        const resultado = await resposta.json().catch(() => ({}));

        // token vencido manda pro login em vez de deixar a tela quebrada
        if (resposta.status === 401 && token) {
            esquecerLogin();
            irPara("login.html");
            return null;
        }

        if (!resposta.ok) {
            avisar(resultado.erro || "Algo deu errado. Tenta de novo.");
            return null;
        }

        return resultado;
    } catch (erro) {
        avisar("Não consegui falar com o servidor. O back-end está rodando?");
        return null;
    }
}


function listar(id, itens, molde, textoSeVazio) {
    if (!itens || itens.length === 0) {
        escrever(id, `<p class="mo-vazio mensagemVazia">${textoSeVazio}</p>`);
        return;
    }

    // aplica o molde em cada item e junta tudo numa string so
    escrever(id, itens.map(molde).join(""));
}



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


function guardarLogin(resposta) {
    localStorage.setItem("token", resposta.token);
    localStorage.setItem("usuario", JSON.stringify(resposta.usuario));
}

function esquecerLogin() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
}

function euSou() {
    try {
        return JSON.parse(localStorage.getItem("usuario"));
    } catch (erro) {
        return null;
    }
}

function meuId() {
    const eu = euSou();

    return eu ? eu.id : null;
}

function protegerPagina() {
    if (localStorage.getItem("token")) return;

    // guarda onde a pessoa queria chegar pra devolver ela depois do login
    sessionStorage.setItem("destino", location.pathname.split("/").pop() + location.search);
    irPara("login.html");
}


// so aceita caminho da propria aplicacao: destino com // ou com esquema e descartado
function destinoGuardado() {
    const destino = sessionStorage.getItem("destino");
    sessionStorage.removeItem("destino");

    if (!destino || destino.startsWith("//") || destino.includes(":")) return null;

    return destino;
}

function fazerLogout() {
    esquecerLogin();
    irPara("login.html");
}

function filtros(valores) {
    const partes = [];

    for (const chave in valores) {
        const valor = valores[chave];

        if (valor !== null && valor !== undefined && valor !== "" && valor !== "Todos") {
            partes.push(`${chave}=${encodeURIComponent(valor)}`);
        }
    }

    return partes.length > 0 ? `?${partes.join("&")}` : "";
}

function parametro(nome) {
    return new URLSearchParams(window.location.search).get(nome);
}


const NIVEIS = {
    1: "Iniciante",
    2: "Intermediário",
    3: "Avançado",
    4: "Especialista",
};

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


const ICONES = {
    grafico: `<polyline points="3 17 9 11 13 15 21 6" fill="none" stroke="currentColor" stroke-width="2"/>`,
    pasta: `<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="2"/>`,
    estrela: `<path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6L3.3 9.4l6-.9z" fill="currentColor"/>`,
    pessoas: `<circle cx="9" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 5.5a3 3 0 0 1 0 5.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M17.5 14.5a5 5 0 0 1 3 5.5" fill="none" stroke="currentColor" stroke-width="2"/>`,
    relogio: `<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="12 7 12 12 16 14" fill="none" stroke="currentColor" stroke-width="2"/>`,
    confere: `<polyline points="4 12.5 9.5 18 20 6.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"/>`,
};


// devolve o svg montado: o viewBox e sempre 24 pra todos alinharem na mesma grade
function icone(nome, tamanho = 16) {
    if (!ICONES[nome]) return "";

    return `<svg viewBox="0 0 24 24" width="${tamanho}" height="${tamanho}" aria-hidden="true" focusable="false">${ICONES[nome]}</svg>`;
}
