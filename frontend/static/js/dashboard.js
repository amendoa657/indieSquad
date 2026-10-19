

protegerPagina();

async function carregarDashboard() {
    // O dashboard é sempre o de quem está logado, por isso não tem id na URL.
    const dados = await pedir("/dashboard");
    if (!dados) return;

    escrever("nomeUsuario", escapar(dados.nome));
    escrever("totalProjetosAtivos", dados.projetosAtivos);
    escrever("totalColaboracoes", dados.colaboracoes);
    escrever("taxaConclusao", `${dados.taxaConclusao}%`);
    escrever("totalProjetosCriados", dados.totalProjetos);

    listar("listaProjetosDashboard", dados.projetos, function (projeto) {
        const pendentes = projeto.candidaturasPendentes > 0
            ? `<span class="aviso">${plural(projeto.candidaturasPendentes, "candidatura esperando", "candidaturas esperando")} você</span>`
            : "";

        return `
            <div class="cardProjetoDashboard" style="cursor: pointer" onclick="irPara('projeto.html?id=${projeto.id}')">
                <div class="infoProjetoDashboard">
                    <h2>${escapar(projeto.nome)}</h2>
                    <p>${plural(projeto.membros, "membro", "membros")} · ${projeto.progresso}% das vagas preenchidas</p>
                    ${pendentes}
                    <div class="barraProgresso" role="progressbar" aria-valuenow="${projeto.progresso}" aria-valuemin="0" aria-valuemax="100" aria-label="Vagas preenchidas">
                        <div class="barraProgressoPreenchida" style="transform: scaleX(${projeto.progresso / 100})"></div>
                    </div>
                </div>
                <span class="setaCardProjeto">›</span>
            </div>
        `;
    }, "Você ainda não tem projetos ativos.");

    // Os projetos em que a pessoa entrou como membro. Antes eles não apareciam
    // em lugar nenhum, só contavam no número de colaborações.
    if (pegar("listaColaboracoes")) {
        listar("listaColaboracoes", dados.participacoes, function (projeto) {
            return `
                <div class="cardProjetoDashboard" style="cursor: pointer" onclick="irPara('projeto.html?id=${projeto.id}')">
                    <div class="infoProjetoDashboard">
                        <h2>${escapar(projeto.nome)}</h2>
                        <p>${escapar(projeto.cargo)} · criado por ${escapar(projeto.criador)}</p>
                    </div>
                    <span class="setaCardProjeto">›</span>
                </div>
            `;
        }, "Você ainda não entrou em nenhum projeto de outra pessoa.");
    }
}

carregarDashboard();
