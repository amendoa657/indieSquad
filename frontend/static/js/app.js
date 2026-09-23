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



// Devolve a cor certa pro status de uma candidatura.
function corDoStatus(status) {
    if (status === "aceita") return "statusAceita";
    if (status === "recusada") return "statusRecusada";
    return "statusPendente";
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


const ICONES = {
    grafico: `<svg viewBox="0 0 24 24" width="13" height="13"><polyline points="3 17 9 11 13 15 21 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    pasta: `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
};
