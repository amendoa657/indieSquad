

protegerPagina();

async function carregarDashboard() {
    // o dashboard e sempre o de quem esta logado, por isso nao tem id na URL
    const dados = await pedir("/dashboard");
    if (!dados) return;

    escrever("nomeUsuario", escapar(dados.nome));
    escrever("totalProjetosAtivos", dados.projetosAtivos);
    escrever("totalColaboracoes", dados.colaboracoes);
    escrever("taxaConclusao", `${dados.taxaConclusao}%`);
    escrever("totalProjetosCriados", dados.totalProjetos);

    listar("listaProjetosDashboard", dados.projetos, function (projeto) {
        const pendentes = projeto.candidaturasPendentes > 0
            ? `<span class="mo-selo">${plural(projeto.candidaturasPendentes, "candidatura esperando", "candidaturas esperando")} você</span>`
            : "";

        return `
            <a class="mo-cartao mo-cartao--linha linhaProjeto" href="projeto.html?id=${projeto.id}" data-mo-carregando="${escapar(projeto.nome)}">
                <div class="linhaProjetoInfo">
                    <h3>${escapar(projeto.nome)}</h3>
                    <p class="mo-legenda">${plural(projeto.membros, "membro", "membros")} · ${projeto.progresso}% das vagas preenchidas</p>
                    ${pendentes}
                    <progress class="mo-barra" value="${projeto.progresso}" max="100" aria-label="Vagas preenchidas"></progress>
                </div>
                <span class="linhaProjetoSeta" aria-hidden="true"></span>
            </a>
        `;
    }, "Você ainda não tem projetos ativos.");

    // os projetos em que a pessoa entrou como membro
    if (pegar("listaColaboracoes")) {
        listar("listaColaboracoes", dados.participacoes, function (projeto) {
            return `
                <a class="mo-cartao mo-cartao--linha linhaProjeto" href="projeto.html?id=${projeto.id}" data-mo-carregando="${escapar(projeto.nome)}">
                    <div class="linhaProjetoInfo">
                        <h3>${escapar(projeto.nome)}</h3>
                        <p class="mo-legenda">${escapar(projeto.cargo)} · criado por ${escapar(projeto.criador)}</p>
                    </div>
                    <span class="linhaProjetoSeta" aria-hidden="true"></span>
                </a>
            `;
        }, "Você ainda não entrou em nenhum projeto de outra pessoa.");
    }
}

carregarDashboard();
