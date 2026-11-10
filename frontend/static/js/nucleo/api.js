// a conversa com o back-end

// endereco do back-end
const API = "http://localhost:5000";


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
        // se a resposta nao for json o catch devolve objeto vazio pra nao quebrar
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
