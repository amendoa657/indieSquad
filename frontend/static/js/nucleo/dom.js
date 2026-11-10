// atalhos pra ler e escrever na tela

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


function listar(id, itens, molde, textoSeVazio) {
    if (!itens || itens.length === 0) {
        escrever(id, `<p class="mensagemVazia">${textoSeVazio}</p>`);
        return;
    }

    // aplica o molde em cada item e junta tudo numa string so
    escrever(id, itens.map(molde).join(""));
}


function parametro(nome) {
    return new URLSearchParams(window.location.search).get(nome);
}
