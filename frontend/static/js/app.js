// Endereço do back-end
const API = "http://localhost:5000";


// Pega um pedaço do HTML pelo id.
function pegar(id) {
    return document.getElementById(id);
}
// Pega o que o usuário digitou no campo.
function valor(id) {
    return pegar(id).value.trim();
}

// Escreve algo dentro de um pedaço do HTML.
function escrever(id, conteudo) {
    const alvo = pegar(id);

    if (alvo) {
        alvo.innerHTML = conteudo;
    }
}

// Deixa um texto digitado por outra pessoa seguro pra entrar no HTML.
//
// Sem isso, alguém com o nome "<img onerror=...>" conseguia rodar código na
// tela de quem visse o perfil dela. Toda vez que o texto vem do banco e entra
// num template, ele passa por aqui primeiro.
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

// Troca de página
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

// Liga o botão do olhinho
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
        // O token vai em todo pedido. O back-end confere a assinatura dele pra
        // saber quem está falando; antes ele confiava no id que o próprio
        // front mandava, o que deixava qualquer um se passar por outra pessoa.
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

        // Traduz a resposta do servidor (texto) pra algo que o JS entende.
        const resultado = await resposta.json().catch(() => ({}));

        // Token vencido ou inválido: manda pro login em vez de deixar a tela
        // quebrada com "undefined" em todo canto.
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
        escrever(id, `<p class="mensagemVazia">${textoSeVazio}</p>`);
        return;
    }

    // .map() aplica o molde em cada item,
    escrever(id, itens.map(molde).join(""));
}



// Devolve a cor certa pro status de uma candidatura.
function corDoStatus(status) {
    if (status === "aceita") return "statusAceita";
    if (status === "recusada") return "statusRecusada";
    return "statusPendente";
}

// Mostra a data do jeito que a gente lê.
function dataBonita(data) {
    if (!data) {
        return "";
    }

    return new Date(data).toLocaleDateString("pt-BR");
}


// Guarda quem entrou. O id vem do próprio back-end no login, não é mais
// adivinhado quebrando o texto do token.
function guardarLogin(resposta) {
    localStorage.setItem("token", resposta.token);
    localStorage.setItem("usuario", JSON.stringify(resposta.usuario));
}

function esquecerLogin() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
}

// Devolve os dados de quem está logado, ou null.
function euSou() {
    try {
        return JSON.parse(localStorage.getItem("usuario"));
    } catch (erro) {
        return null;
    }
}

// Devolve o id de quem está logado.
function meuId() {
    const eu = euSou();

    return eu ? eu.id : null;
}

// Não está logado? Chuta pra tela de login.
function protegerPagina() {
    if (!localStorage.getItem("token")) {
        irPara("login.html");
    }
}

// Botão Sair: esquece o login e volta pro login.
function fazerLogout() {
    esquecerLogin();
    irPara("login.html");
}

// Monta a parte de filtros de um endereço, já escapando o que o usuário digitou.
//
// Antes o termo entrava cru na URL, então um "&" ou um "#" na busca quebrava
// o pedido inteiro.
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

// Lê um parâmetro do endereço da página (ex: projeto.html?id=3).
function parametro(nome) {
    return new URLSearchParams(window.location.search).get(nome);
}


const NIVEIS = {
    1: "Iniciante",
    2: "Intermediário",
    3: "Avançado",
    4: "Especialista",
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


const ICONES = {
    grafico: `<svg viewBox="0 0 24 24" width="13" height="13"><polyline points="3 17 9 11 13 15 21 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    pasta: `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    estrela: `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6L3.3 9.4l6-.9z" fill="currentColor"/></svg>`,
    pessoas: `<svg viewBox="0 0 24 24" width="13" height="13"><circle cx="9" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 5.5a3 3 0 0 1 0 5.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M17.5 14.5a5 5 0 0 1 3 5.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    relogio: `<svg viewBox="0 0 24 24" width="13" height="13"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="12 7 12 12 16 14" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
};
