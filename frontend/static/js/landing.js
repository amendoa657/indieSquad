// Os números do topo da landing vêm do banco.
//
// Antes eram "93%", "2.4k+" e "380+" escritos na mão no HTML, sem vir de
// lugar nenhum. Começar pequeno e verdadeiro é melhor do que parecer grande
// e não conseguir explicar de onde saiu o número.

async function carregarEstatisticas() {
    const dados = await pedir("/estatisticas");
    if (!dados) return;

    escrever("totalProfissionais", dados.profissionais);
    escrever("totalProjetos", dados.projetos);
    escrever("totalAvaliacoes", dados.avaliacoes);
}

carregarEstatisticas();
