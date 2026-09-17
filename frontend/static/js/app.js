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
    pegar(id).innerHTML = conteudo;
}

// Troca de página
function irPara(pagina) {
    window.location.href = pagina;
}

function avisar(texto) {
    if (pegar("mensagemErro")) {
        escrever("mensagemErro", texto);
    } else if (texto) {
        alert(texto);
    }
}

function avisarSucesso(texto) {
    if (pegar("mensagemSucesso")) {
        escrever("mensagemSucesso", texto);
    }
}

// Liga o botão do olhinho
function ligarOlhinho() {
    pegar("botaoOlho").onclick = function () {
        const campo = pegar("senha");
        campo.type = campo.type === "password" ? "text" : "password";
    };
}

async function pedir(caminho, metodo = "GET", dados = null) {
    try {
    
        const resposta = await fetch(API + caminho, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: dados ? JSON.stringify(dados) : null,
        });

        // Traduz a resposta do servidor (texto) pra algo que o JS entende.
        const resultado = await resposta.json().catch(() => ({}));

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
    if (itens.length === 0) {
        escrever(id, `<p class="mensagemVazia">${textoSeVazio}</p>`);
        return;
    }

    // .map() aplica o molde em cada item, 
    escrever(id, itens.map(molde).join(""));
}



// Devolve o id de quem está logado.
function meuId() {
    const token = localStorage.getItem("token");
    return token ? token.split("-")[1] : null;
}

// Não está logado? Chuta pra tela de login.
function protegerPagina() {
    if (!localStorage.getItem("token")) {
        irPara("login.html");
    }
}

// Botão Sair: esquece o token e volta pro login.
function fazerLogout() {
    localStorage.removeItem("token");
    irPara("login.html");
}


const MENU = [
    { texto: "Dashboard",       pagina: "dashboard.html",        icone: "painel" },
    { texto: "Buscar",          pagina: "busca.html",            icone: "lupa" },
    { texto: "Publicar Projeto",pagina: "publicar-projeto.html", icone: "mais" },
    { texto: "Meu Perfil",      pagina: "perfil.html",           icone: "pessoa" },
];


function montarMenu(destaque = window.location.pathname.split("/").pop()) {
    const itens = MENU.map(function (item) {
        const aceso = item.pagina === destaque ? "ativo" : "";
        return `
            <a href="${item.pagina}" class="itemSidebar ${aceso}">
                ${ICONES[item.icone]} ${item.texto}
            </a>
        `;
    }).join("");

    escrever("menu", `
        <div>
            <div class="logoSidebar">
                <img src="static/assets/Logo.svg" alt="" />
                <h3>INDIE<span>SQUAD</span></h3>
            </div>
            <div class="navSidebar">${itens}</div>
        </div>

        <button type="button" class="botaoSairSidebar" onclick="fazerLogout()">
            ${ICONES.sair} Sair
        </button>
    `);
}

function iniciarPagina(destaque) {
    protegerPagina();
    montarMenu(destaque);
}


const ICONES = {
    painel: `<svg class="iconeSidebar" viewBox="0 0 24 24" width="18" height="18"><rect x="3" y="3" width="8" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13" y="3" width="8" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="3" y="13" width="8" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13" y="13" width="8" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    lupa: `<svg class="iconeSidebar" viewBox="0 0 24 24" width="18" height="18"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="15.5" y2="15.5" stroke="currentColor" stroke-width="2"/></svg>`,
    mais: `<svg class="iconeSidebar" viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2"/></svg>`,
    pessoa: `<svg class="iconeSidebar" viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor"/></svg>`,
    sair: `<svg class="iconeSidebar" viewBox="0 0 24 24" width="18" height="18"><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="16 16 21 12 16 8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2"/></svg>`,
    grafico: `<svg viewBox="0 0 24 24" width="13" height="13"><polyline points="3 17 9 11 13 15 21 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    pasta: `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
};
