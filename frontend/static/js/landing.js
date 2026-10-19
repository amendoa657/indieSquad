// os numeros do topo da landing vem do banco

async function carregarEstatisticas() {
    const dados = await pedir("/estatisticas");
    if (!dados) return;

    escrever("totalProfissionais", dados.profissionais);
    escrever("totalProjetos", dados.projetos);
    escrever("totalAvaliacoes", dados.avaliacoes);
}

carregarEstatisticas();
