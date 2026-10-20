

protegerPagina();

async function carregarDashboard() {
    // o dashboard e sempre o de quem esta logado, por isso nao tem id na URL
    const dados = await pedir("/dashboard");
    if (!dados) return;

    escrever("nomeUsuario", escapar(dados.nome.split(" ")[0]));
    escrever("totalProjetosAtivos", dados.projetosAtivos);
    escrever("totalColaboracoes", dados.colaboracoes);
    escrever("taxaConclusao", `${dados.taxaConclusao}%`);
    escrever("totalProjetosCriados", dados.totalProjetos);
    escrever("contadorProjetos", dados.projetos.length);
    escrever("contadorParticipacoes", dados.participacoes.length);

    // candidatura esperando resposta vira uma faixa no topo, com o atalho pro projeto
    const comPendencia = dados.projetos.filter((projeto) => projeto.candidaturasPendentes > 0);

    if (comPendencia.length > 0) {
        const total = comPendencia.reduce((soma, projeto) => soma + projeto.candidaturasPendentes, 0);
        const primeiro = comPendencia[0];

        escrever("avisoPendencias", `
            <mo-simbolo nome="sino"></mo-simbolo>
            <p><strong>${plural(total, "candidatura esperando", "candidaturas esperando")} você.</strong>
            Alguém quer entrar ${comPendencia.length === 1 ? `em <em>${escapar(primeiro.nome)}</em>` : "nos seus projetos"}.</p>
            <a class="mo-tecla mo-tecla--destaque mo-tecla--p" href="projeto.html?id=${primeiro.id}#blocoCandidaturas">Ver candidaturas</a>
        `);
        pegar("avisoPendencias").classList.remove("escondido");
    }

    listar("listaProjetosDashboard", dados.projetos, function (projeto) {
        const pendentes = projeto.candidaturasPendentes > 0
            ? `<span class="selo selo-pendente">${plural(projeto.candidaturasPendentes, "nova", "novas")}</span>`
            : "";

        const ficha = [projeto.genero, projeto.engine].filter(Boolean).map(escapar).join(" · ");

        return `
            <article class="cartao cartaoClicavel mira cartaoProjetoPainel" onclick="irPara('projeto.html?id=${projeto.id}')">
                <div class="cartaoTopo">
                    ${cartucho(projeto.nome, 46)}
                    <div class="cartaoTitulo">
                        <h3>${escapar(projeto.nome)}</h3>
                        <span>${ficha || "Sem ficha técnica"}</span>
                    </div>
                    ${pendentes}
                </div>

                <div class="linhaMedidor">
                    <span>Equipe</span>
                    <is-medidor valor="${projeto.progresso}" segmentos="12"></is-medidor>
                    <strong>${projeto.progresso}%</strong>
                </div>

                <div class="cartaoPe">
                    <span class="dado"><mo-simbolo nome="usuario"></mo-simbolo>${plural(projeto.membros, "membro", "membros")}</span>
                    <span class="dado"><mo-simbolo nome="pasta"></mo-simbolo>${plural(projeto.vagasAbertas, "vaga aberta", "vagas abertas")}</span>
                    <span class="dado"><mo-simbolo nome="bandeira"></mo-simbolo>${projeto.marcosConcluidos}/${projeto.totalMarcos} marcos</span>
                </div>
            </article>
        `;
    }, "Você ainda não tem projetos ativos. Publique um e a equipe começa a se formar aqui.");

    // os projetos em que a pessoa entrou como membro
    if (pegar("listaColaboracoes")) {
        listar("listaColaboracoes", dados.participacoes, function (projeto) {
            return `
                <article class="cartao cartaoClicavel mira" onclick="irPara('projeto.html?id=${projeto.id}')">
                    <div class="cartaoTopo">
                        ${cartucho(projeto.nome, 40)}
                        <div class="cartaoTitulo">
                            <h3>${escapar(projeto.nome)}</h3>
                            <span>${escapar(projeto.cargo)} · criado por ${escapar(projeto.criador)}</span>
                        </div>
                    </div>
                </article>
            `;
        }, "Você ainda não entrou em nenhum projeto de outra pessoa.");

        if (dados.participacoes.length === 0) {
            pegar("listaColaboracoes").insertAdjacentHTML("beforeend",
                `<a class="linkMensagemVazia" href="busca.html">Procurar uma vaga →</a>`);
        }
    }
}

carregarDashboard();
