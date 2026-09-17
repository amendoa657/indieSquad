

iniciarPagina();

async function carregarDashboard() {
    // Pede pro back-end o resumo de quem está logado.
    const dados = await pedir(`/dashboard/${meuId()}`);
    if (!dados) return;

    escrever("nomeUsuario", dados.nome);
    escrever("statProjetosAtivos", dados.projetosAtivos);
    escrever("statColaboracoes", dados.colaboracoes);
    escrever("statTaxaConclusao", `${dados.taxaConclusao}%`);
    escrever("statTotalProjetos", dados.totalProjetos);

    listar("listaProjetosDash", dados.projetos, function (projeto) {
        return `
            <div class="projetoDashCard" style="cursor: pointer" onclick="irPara('projeto.html?id=${projeto.id}')">
                <div class="projetoDashInfo">
                    <h2>${projeto.nome}</h2>
                    <p>${projeto.membros} membro(s)</p>
                    <div class="barraProgresso">
                        <div class="barraProgressoPreenchida" style="width: ${projeto.progresso}%"></div>
                    </div>
                </div>
                <span class="chevronDash">›</span>
            </div>
        `;
    }, "Você ainda não tem projetos ativos.");
}

carregarDashboard();
