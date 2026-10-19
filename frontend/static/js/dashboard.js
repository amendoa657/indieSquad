

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
            ? `<span class="aviso">${projeto.candidaturasPendentes} candidatura(s) esperando você</span>`
            : "";

        return `
            <div class="cardProjetoDashboard" style="cursor: pointer" onclick="irPara('projeto.html?id=${projeto.id}')">
                <div class="infoProjetoDashboard">
                    <h2>${escapar(projeto.nome)}</h2>
                    <p>${projeto.membros} membro(s) · ${projeto.progresso}% das vagas preenchidas</p>
                    ${pendentes}
                    <div class="barraProgresso">
                        <div class="barraProgressoPreenchida" style="width: ${projeto.progresso}%"></div>
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
