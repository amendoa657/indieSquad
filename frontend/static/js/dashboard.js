

protegerPagina();

async function carregarDashboard() {
    // Pede pro back-end o resumo de quem está logado.
    const dados = await pedir(`/dashboard/${meuId()}`);
    if (!dados) return;

    escrever("nomeUsuario", dados.nome);
    escrever("totalProjetosAtivos", dados.projetosAtivos);
    escrever("totalColaboracoes", dados.colaboracoes);
    escrever("taxaConclusao", `${dados.taxaConclusao}%`);
    escrever("totalProjetosCriados", dados.totalProjetos);

    listar("listaProjetosDashboard", dados.projetos, function (projeto) {
        return `
            <div class="cardProjetoDashboard" style="cursor: pointer" onclick="irPara('projeto.html?id=${projeto.id}')">
                <div class="infoProjetoDashboard">
                    <h2>${projeto.nome}</h2>
                    <p>${projeto.membros} membro(s) · ${projeto.progresso}% das vagas preenchidas</p>
                    <div class="barraProgresso">
                        <div class="barraProgressoPreenchida" style="width: ${projeto.progresso}%"></div>
                    </div>
                </div>
                <span class="setaCardProjeto">›</span>
            </div>
        `;
    }, "Você ainda não tem projetos ativos.");
}

carregarDashboard();
