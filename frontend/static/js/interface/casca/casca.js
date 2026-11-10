// a casca das telas logadas: quem esta jogando (o cartao no pe do menu e o
// chip do cabecalho) e a barra de status embaixo, com a API e os numeros


function preencherJogador() {
    const eu = euSou();
    if (!eu) return;

    document.querySelectorAll("[data-jogador-nome]").forEach((el) => (el.textContent = eu.usuario));
    document.querySelectorAll("[data-jogador-handle]").forEach((el) => (el.textContent = `@${eu.handle}`));
    document.querySelectorAll("[data-jogador-sprite]").forEach((el) => el.setAttribute("semente", eu.handle));

    // a cor do seu bonequinho e a da sua funcao mais forte, como no resto do app
    comFuncoes(eu).then(function (pessoa) {
        const principal = funcaoPrincipal(pessoa);
        if (!principal) return;

        document.querySelectorAll("[data-jogador-sprite]").forEach((el) => el.classList.add(classe(principal.categoria)));
    });
}


async function preencherStatus() {
    const status = pegar("statusApi");
    if (!status) return;

    try {
        const resposta = await fetch(API + "/estatisticas");
        const dados = await resposta.json();

        status.querySelector("span").textContent = "api online";
        escrever("statusNumeros",
            `${plural(dados.profissionais, "jogador", "jogadores")} · ${plural(dados.projetos, "projeto", "projetos")}`);
    } catch (erro) {
        status.classList.add("fora");
        status.querySelector("span").textContent = "api fora do ar";
    }
}


// a busca do cabecalho manda pra tela de busca com o termo no endereco
const buscaRapida = document.querySelector(".buscaRapida");

if (buscaRapida) {
    buscaRapida.onsubmit = function (evento) {
        evento.preventDefault();
        const termo = buscaRapida.querySelector("input").value.trim();
        irPara(`busca.html${termo ? `?q=${encodeURIComponent(termo)}` : ""}`);
    };
}

preencherJogador();
preencherStatus();
