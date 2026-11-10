// quem esta logado: o token e o usuario guardados no navegador

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

    // isso barra endereco de outro site pra ninguem usar o login pra mandar a pessoa pra fora do indiesquad
    if (!destino || destino.startsWith("//") || destino.includes(":")) return null;

    return destino;
}

function fazerLogout() {
    esquecerLogin();
    irPara("login.html");
}
