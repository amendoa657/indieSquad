
protegerPagina();


const idProjeto = parametro("id");
let skillsDoBanco = [];


async function candidatar(idVaga) {
    avisar("");

    const mensagem = prompt("Escreve uma mensagem pro dono do projeto (opcional):") || "";

    const resposta = await pedir("/candidaturas", "POST", {
        idVagaProjeto: idVaga,
        mensagem: mensagem,
    });

    if (!resposta) return;

    avisarSucesso("Candidatura enviada! Acompanhe em 'Minhas Candidaturas'.");
    carregarProjeto();
}


async function responder(idCandidatura, status) {
    avisar("");

    // um pedido so: aceitar ja poe na equipe, fecha a vaga e recusa as outras
    const resposta = await pedir(`/candidaturas/${idCandidatura}/responder`, "PUT", { status: status });
    if (!resposta) return;

    carregarProjeto();
}


async function concluir() {
    if (!confirm("Concluir o projeto? Isso fecha as vagas abertas e libera a avaliação entre a equipe.")) {
        return;
    }

    const resposta = await pedir(`/projetos/${idProjeto}/concluir`, "PATCH");
    if (!resposta) return;

    avisarSucesso("Projeto concluído!");
    carregarProjeto();
}


// avaliacao da equipe

// cinco estrelas por criterio
function estrelas(criterio, idColega) {
    const nome = `${criterio}-${idColega}`;

    let html = `<div class="estrelas">`;

    for (let valor = 5; valor >= 1; valor--) {
        html += `
            <input type="radio" name="${nome}" id="${nome}-${valor}" value="${valor}" ${valor === 5 ? "" : ""} />
            <label for="${nome}-${valor}" title="${valor} de 5" aria-label="${valor} de 5">${icone("estrela", 22)}</label>
        `;
    }

    return html + `</div>`;
}


function campoNota(rotulo, criterio, idColega) {
    return `
        <div class="campoNota">
            <span class="rotuloNota">${rotulo}</span>
            ${estrelas(criterio, idColega)}
        </div>
    `;
}


function notaEscolhida(criterio, idColega) {
    const marcado = document.querySelector(`input[name="${criterio}-${idColega}"]:checked`);

    return marcado ? Number(marcado.value) : null;
}


async function avaliar(idColega) {
    avisar("");

    const comunicacao = notaEscolhida("comunicacao", idColega);
    const prazo = notaEscolhida("prazo", idColega);
    const qualidade = notaEscolhida("qualidade", idColega);

    if (!comunicacao || !prazo || !qualidade) {
        avisar("Dê uma nota pros três critérios antes de enviar.");
        return;
    }

    const resposta = await pedir("/avaliacoes", "POST", {
        idProjeto: Number(idProjeto),
        idAvaliado: idColega,
        notaComunicacao: comunicacao,
        notaPrazo: prazo,
        notaQualidade: qualidade,
        comentario: pegar(`comentario-${idColega}`).value.trim(),
    });

    if (!resposta) return;

    avisarSucesso(resposta.mensagem);
    carregarAvaliacoes();
}


function cardColega(colega) {
    const pessoa = colega.usuario;
    const cabecalho = `
        <div class="topoCardResultado">
            <h2>
                <span class="avatarMembro">${escapar(pessoa.usuario.charAt(0).toUpperCase())}</span>
                ${escapar(pessoa.usuario)}
            </h2>
        </div>
    `;

    // ja recebi a avaliacao dela: as duas enviaram, entao as duas aparecem
    if (colega.recebida) {
        const recebida = colega.recebida;

        return `
            <div class="mo-cartao cardResultado">
                ${cabecalho}
                <div class="notasRecebidas">
                    <span class="notaGrande">${numero(recebida.nota, 0)}</span>
                    <div class="detalheNotas">
                        <span>Comunicação ${recebida.notaComunicacao}</span>
                        <span>Prazo ${recebida.notaPrazo}</span>
                        <span>Qualidade ${recebida.notaQualidade}</span>
                    </div>
                </div>
                ${recebida.comentario ? `<p class="descricaoResultado">“${escapar(recebida.comentario)}”</p>` : ""}
            </div>
        `;
    }

    // eu ja avaliei, mas a outra pessoa ainda nao
    if (colega.esperandoResposta) {
        return `
            <div class="mo-cartao cardResultado">
                ${cabecalho}
                <p class="avisoEspera">
                    Você já avaliou. A sua nota e a dela só aparecem quando ${escapar(pessoa.usuario)} também avaliar.
                </p>
            </div>
        `;
    }

    return `
        <div class="mo-cartao cardResultado">
            ${cabecalho}
            ${campoNota("Comunicação", "comunicacao", pessoa.id)}
            ${campoNota("Cumpriu prazos", "prazo", pessoa.id)}
            ${campoNota("Qualidade da entrega", "qualidade", pessoa.id)}

            <div class="campoFormulario">
                <label for="comentario-${pessoa.id}">Comentário</label>
                <textarea id="comentario-${pessoa.id}" placeholder="O que foi bom, o que daria pra melhorar..."></textarea>
            </div>

            <button type="button" class="mo-tecla mo-tecla--destaque botaoEnviar" onclick="avaliar(${pessoa.id})">Enviar avaliação</button>
        </div>
    `;
}


async function carregarAvaliacoes() {
    const dados = await pedir(`/projetos/${idProjeto}/avaliacoes`);
    if (!dados) return;

    pegar("blocoAvaliacoes").classList.remove("escondido");

    escrever("explicacaoDuploCego",
        `A sua avaliação fica escondida até a outra pessoa enviar a dela, ou até passar ${dados.prazoLiberacaoDias} dias. ` +
        `Assim ninguém avalia já sabendo que nota vai receber de volta.`);

    listar("listaAvaliacoes", dados.colegas, cardColega, "Você foi o único participante desse projeto.");
}


// match

// a cor acompanha a nota: verde combina muito, laranja combina em parte
function classeDaNota(nota) {
    if (nota >= 70) return "notaAlta";
    if (nota >= 45) return "notaMedia";
    return "notaBaixa";
}


function seloCompatibilidade(compatibilidade) {
    if (!compatibilidade) return "";

    const fortes = compatibilidade.fortes.map((texto) => `<li class="pontoForte">${escapar(texto)}</li>`).join("");
    const fracos = compatibilidade.fracos.map((texto) => `<li class="pontoFraco">${escapar(texto)}</li>`).join("");

    return `
        <div class="blocoCompatibilidade">
            <div class="topoCompatibilidade">
                <span class="notaCompatibilidade ${classeDaNota(compatibilidade.nota)}">${compatibilidade.nota}%</span>
                <span class="rotuloCompatibilidade">compatível com você</span>
            </div>
            <ul class="listaPontos">${fortes}${fracos}</ul>
        </div>
    `;
}


async function verRecomendados(idVaga) {
    const alvo = pegar(`recomendados-${idVaga}`);
    const card = alvo.closest(".cardResultado");

    if (!alvo.classList.contains("escondido")) {
        alvo.classList.add("escondido");
        card.classList.remove("vagaExpandida");
        return;
    }

    alvo.classList.remove("escondido");
    card.classList.add("vagaExpandida");
    escrever(`recomendados-${idVaga}`, `<p class="mo-vazio mensagemVazia">Procurando quem combina...</p>`);

    const dados = await pedir(`/vagas/${idVaga}/recomendacoes`);
    if (!dados) return;

    listar(`recomendados-${idVaga}`, dados.candidatos, function (candidato) {
        const pessoa = candidato.usuario;
        const nota = candidato.compatibilidade.nota;

        const situacao = candidato.jaEhMembro
            ? `<span class="mo-chip tagSkill">Já está na equipe</span>`
            : candidato.jaSeCandidatou
                ? `<span class="mo-chip tagSkill">Já se candidatou</span>`
                : "";

        const marcaIA = candidato.explicadoPorIA
            ? `<span class="selaIA" title="Texto escrito por IA a partir dos dados do perfil">IA</span>`
            : "";

        return `
            <div class="cardRecomendado cardClicavel" onclick="irPara('perfil.html?handle=${encodeURIComponent(pessoa.handle)}')">
                <div class="topoCardResultado">
                    <h2>
                        <span class="avatarMembro">${escapar(pessoa.usuario.charAt(0).toUpperCase())}</span>
                        ${escapar(pessoa.usuario)}
                    </h2>
                    <span class="notaCompatibilidade ${classeDaNota(nota)}">${nota}%</span>
                </div>
                <p class="descricaoResultado">${marcaIA} ${escapar(candidato.explicacao)}</p>
                <div class="tagsResultado">
                    ${pessoa.skills.map((skill) => `<span class="mo-chip tagSkill">${escapar(skill.nome)}</span>`).join("")}
                    ${situacao}
                </div>
            </div>
        `;
    }, "Ninguém com perfil preenchido combina com essa vaga ainda.");
}


// gerenciar projeto

function alternarBloco(id) {
    pegar(id).classList.toggle("escondido");
}


async function apagarProjeto() {
    if (!confirm("Apagar o projeto? Isso remove as vagas, as candidaturas e a equipe junto.")) {
        return;
    }

    const resposta = await pedir(`/projetos/${idProjeto}`, "DELETE");
    if (!resposta) return;

    irPara("dashboard.html");
}


async function carregarSkills() {
    if (skillsDoBanco.length > 0) return;

    skillsDoBanco = (await pedir("/skills")) || [];

    pegar("campoVagaSkill").innerHTML =
        `<option value="">Escolhe uma função...</option>` +
        skillsDoBanco.map((skill) => `<option value="${skill.id}">${escapar(skill.nome)}</option>`).join("");
}


async function criarVaga() {
    avisar("");

    const idSkill = Number(pegar("campoVagaSkill").value);

    if (!idSkill) {
        avisar("Escolhe a função que a vaga pede.");
        return;
    }

    const skill = skillsDoBanco.find((item) => item.id === idSkill);
    const nivel = pegar("campoVagaNivel").value;

    const resposta = await pedir("/vagas", "POST", {
        titulo: skill.nome,
        descricao: valor("campoVagaDescricao"),
        idProjeto: Number(idProjeto),
        idSkill: idSkill,
        nivelMinimo: nivel ? Number(nivel) : null,
    });

    if (!resposta) return;

    pegar("campoVagaDescricao").value = "";
    pegar("campoVagaSkill").value = "";
    avisarSucesso("Vaga aberta.");
    carregarProjeto();
}


async function fecharVaga(idVaga) {
    const resposta = await pedir(`/vagas/${idVaga}`, "PUT", { status: "fechada" });
    if (!resposta) return;

    carregarProjeto();
}


async function reabrirVaga(idVaga) {
    const resposta = await pedir(`/vagas/${idVaga}`, "PUT", { status: "aberta" });
    if (!resposta) return;

    carregarProjeto();
}


async function apagarVaga(idVaga) {
    if (!confirm("Apagar essa vaga? As candidaturas dela somem junto.")) {
        return;
    }

    const resposta = await pedir(`/vagas/${idVaga}`, "DELETE");
    if (!resposta) return;

    carregarProjeto();
}


async function tirarMembro(idUsuario, nome) {
    if (!confirm(`Tirar ${nome} da equipe?`)) {
        return;
    }

    const resposta = await pedir(`/projetos/${idProjeto}/membros/${idUsuario}`, "DELETE");
    if (!resposta) return;

    carregarProjeto();
}


async function criarMarco() {
    avisar("");

    const titulo = valor("campoNovoMarco");

    if (!titulo) {
        avisar("Escreve o nome do marco.");
        return;
    }

    const resposta = await pedir(`/projetos/${idProjeto}/marcos`, "POST", { titulo: titulo });
    if (!resposta) return;

    pegar("campoNovoMarco").value = "";
    carregarProjeto();
}


async function alternarMarco(idMarco, concluido) {
    const resposta = await pedir(`/marcos/${idMarco}`, "PATCH", { concluido: !concluido });
    if (!resposta) return;

    carregarProjeto();
}


async function apagarMarco(idMarco) {
    const resposta = await pedir(`/marcos/${idMarco}`, "DELETE");
    if (!resposta) return;

    carregarProjeto();
}


async function carregarProjeto() {
    if (!idProjeto) {
        avisar("Nenhum projeto informado no endereço.");
        return;
    }

    // a tela inteira vem em tres pedidos, nao em cinco
    const projeto = await pedir(`/projetos/${idProjeto}`);
    if (!projeto) return;

    const membros = (await pedir(`/projetos/${idProjeto}/membros`)) || [];
    const vagas = (await pedir(`/projetos/${idProjeto}/vagas`)) || [];

    escrever("avatarProjeto", escapar(projeto.nome.charAt(0).toUpperCase()));
    escrever("nomeProjeto", escapar(projeto.nome));
    escrever("statusProjeto", escapar(rotulo(projeto.status)));
    escrever("criadorProjeto", escapar(projeto.criador.usuario));
    escrever("descricaoProjeto", escapar(projeto.descricao) || "Sem descrição.");

    escrever("totalMembros", membros.length);
    escrever("totalVagasAbertas", vagas.filter((vaga) => vaga.status === "aberta").length);

    // ficha tecnica: campos que o formulario ja pedia e eram descartados
    if (pegar("fichaProjeto")) {
        const ficha = [
            ["Gênero", projeto.genero],
            ["Engine", projeto.engine],
            ["Parceria", TIPOS_PARCERIA[projeto.tipoParceria] || projeto.tipoParceria],
            ["Duração", projeto.duracaoEstimada],
        ].filter((item) => item[1]);

        listar("fichaProjeto", ficha, function (item) {
            return `<div class="itemFicha"><span>${escapar(item[0])}</span><strong>${escapar(item[1])}</strong></div>`;
        }, "Sem ficha técnica.");
    }

    if (pegar("marcosProjeto")) {
        listar("marcosProjeto", projeto.marcos, function (marco) {
            // o dono marca e desmarca o marco clicando na caixa
            const caixa = projeto.ehCriador
                ? `<span class="caixaMarco caixaMarcoClicavel" onclick="alternarMarco(${marco.id}, ${marco.concluido})" title="Marcar como concluído">${marco.concluido ? icone("confere", 13) : ""}</span>`
                : `<span class="caixaMarco">${marco.concluido ? icone("confere", 13) : ""}</span>`;

            const acoes = projeto.ehCriador
                ? `<div class="acoesItem"><button type="button" class="mo-tecla mo-tecla--sutil mo-tecla--p botaoMiudo mo-tecla--perigo botaoPerigo" onclick="apagarMarco(${marco.id})">Apagar</button></div>`
                : "";

            return `
                <div class="itemMarco ${marco.concluido ? "marcoConcluido" : ""}">
                    ${caixa}
                    ${escapar(marco.titulo)}
                    ${acoes}
                </div>
            `;
        }, "Nenhum marco definido.");
    }

    listar("listaMembros", membros, function (membro) {
        const ehCriadorDoProjeto = membro.id === projeto.criador.id;

        const acoes = projeto.ehCriador && !ehCriadorDoProjeto
            ? `<div class="acoesItem"><button type="button" class="mo-tecla mo-tecla--sutil mo-tecla--p botaoMiudo mo-tecla--perigo botaoPerigo" onclick="event.stopPropagation(); tirarMembro(${membro.id}, '${escapar(membro.usuario).replace(/'/g, "")}')">Tirar</button></div>`
            : "";

        return `
            <div class="itemMembro cardClicavel" onclick="irPara('perfil.html?handle=${encodeURIComponent(membro.handle)}')">
                <span class="avatarMembro">${escapar(membro.usuario.charAt(0).toUpperCase())}</span>
                ${escapar(membro.usuario)}
                <span class="cargoMembro">${escapar(membro.cargo)}</span>
                ${acoes}
            </div>
        `;
    }, "Ninguém na equipe ainda.");

    listar("listaVagas", vagas, function (vaga) {
        const nivel = vaga.nivelMinimo ? `<span class="mo-chip tagSkill">${escapar(NIVEIS[vaga.nivelMinimo])} ou mais</span>` : "";

        // o servidor ja diz se eu me candidatei nessa vaga
        let acao = "";

        if (vaga.minhaCandidatura) {
            acao = `<span class="mo-selo statusCandidatura ${corDoStatus(vaga.minhaCandidatura.status)}">Candidatura ${escapar(rotulo(vaga.minhaCandidatura.status))}</span>`;
        } else if (vaga.status === "aberta" && !projeto.ehCriador) {
            acao = `<button type="button" class="mo-tecla mo-tecla--destaque mo-tecla--p botaoCandidatar" onclick="candidatar(${vaga.id})">Candidatar-se</button>`;
        }

        const recomendar = projeto.ehCriador
            ? `<button type="button" class="mo-tecla mo-tecla--sutil mo-tecla--p botaoMiudo" onclick="verRecomendados(${vaga.id})">Ver quem combina</button>`
            : "";

        const acoesDono = projeto.ehCriador
            ? `<div class="acoesItem">
                   ${recomendar}
                   ${vaga.status === "aberta"
                       ? `<button type="button" class="mo-tecla mo-tecla--sutil mo-tecla--p botaoMiudo" onclick="fecharVaga(${vaga.id})">Fechar</button>`
                       : `<button type="button" class="mo-tecla mo-tecla--sutil mo-tecla--p botaoMiudo" onclick="reabrirVaga(${vaga.id})">Reabrir</button>`}
                   <button type="button" class="mo-tecla mo-tecla--sutil mo-tecla--p botaoMiudo mo-tecla--perigo botaoPerigo" onclick="apagarVaga(${vaga.id})">Apagar</button>
               </div>`
            : "";

        return `
            <div class="mo-cartao cardResultado">
                <div class="topoCardResultado">
                    <h2>${escapar(vaga.titulo)}</h2>
                    <span class="mo-selo statusResultado">${escapar(rotulo(vaga.status))}</span>
                </div>
                <p class="descricaoResultado">${escapar(vaga.descricao)}</p>
                <div class="tagsResultado">
                    <span class="mo-chip tagSkill">${escapar(vaga.skillNome)}</span>
                    ${nivel}
                </div>
                ${seloCompatibilidade(vaga.compatibilidade)}
                ${acao}
                ${acoesDono}
                <div class="listaRecomendados escondido" id="recomendados-${vaga.id}"></div>
            </div>
        `;
    }, "Nenhuma vaga cadastrada pra esse projeto.");

    // a avaliacao abre quando o projeto termina, e so pra quem esteve nele
    if (projeto.status === "concluido" && projeto.ehDaEquipe) {
        carregarAvaliacoes();
    }

    // so o dono do projeto ve e responde as candidaturas
    if (projeto.ehCriador) {
        pegar("blocoCandidaturas").classList.remove("escondido");
        mostrarCandidaturas();

        pegar("blocoDono").classList.remove("escondido");
        pegar("botaoConcluir").disabled = projeto.status === "concluido";

        pegar("campoNomeProjeto").value = projeto.nome || "";
        pegar("campoDescricaoProjeto").value = projeto.descricao || "";
        pegar("campoGeneroProjeto").value = projeto.genero || "";
        pegar("campoEngineProjeto").value = projeto.engine || "";
        pegar("campoDuracaoProjeto").value = projeto.duracaoEstimada || "";

        if (projeto.tipoParceria) {
            pegar("campoParceriaProjeto").value = projeto.tipoParceria;
        }

        // projeto concluido nao volta pra ativo por aqui
        if (projeto.status !== "concluido") {
            pegar("campoStatusProjeto").value = projeto.status;
        }

        carregarSkills();
    }
}


async function mostrarCandidaturas() {
    const candidaturas = await pedir(`/projetos/${idProjeto}/candidaturas`);
    if (!candidaturas) return;

    escrever("totalCandidaturas", candidaturas.length);

    listar("listaCandidaturas", candidaturas, function (candidatura) {
        const pessoa = candidatura.candidato;
        const nota = pessoa.reputacao.total > 0
            ? `<span class="metricaResultado">${icone("estrela")} ${numero(pessoa.reputacao.media)} · ${plural(pessoa.reputacao.total, "avaliação", "avaliações")}</span>`
            : `<span class="metricaResultado">Sem avaliação ainda</span>`;

        // pendente mostra os botoes; ja respondida mostra so o resultado
        const acoes = candidatura.status === "pendente"
            ? `<button type="button" class="mo-tecla mo-tecla--destaque mo-tecla--p botaoCandidatar" onclick="responder(${candidatura.id}, 'aceita')">Aceitar</button>
               <button type="button" class="mo-tecla mo-tecla--destaque mo-tecla--p botaoCandidatar botaoRecusar" onclick="responder(${candidatura.id}, 'recusada')">Recusar</button>`
            : `<span class="mo-selo statusCandidatura ${corDoStatus(candidatura.status)}">${escapar(rotulo(candidatura.status))}</span>`;

        const mensagem = candidatura.mensagem
            ? `<p class="descricaoResultado">“${escapar(candidatura.mensagem)}”</p>`
            : "";

        return `
            <div class="mo-cartao cardResultado">
                <div class="topoCardResultado">
                    <h2>
                        <span class="avatarMembro">${escapar(pessoa.usuario.charAt(0).toUpperCase())}</span>
                        ${escapar(pessoa.usuario)}
                    </h2>
                    <span class="mo-selo statusResultado">${escapar(candidatura.vaga.titulo)}</span>
                </div>
                <div class="metricasResultado">${nota}</div>
                <div class="tagsResultado">
                    ${pessoa.skills.map((skill) => `<span class="mo-chip tagSkill">${escapar(skill.nome)} · ${escapar(NIVEIS[skill.nivel])}</span>`).join("")}
                </div>
                ${mensagem}
                ${acoes}
            </div>
        `;
    }, "Ninguém se candidatou ainda.");
}

pegar("formProjeto").onsubmit = async function (evento) {
    evento.preventDefault();
    avisar("");
    avisarSucesso("");

    const resposta = await pedir(`/projetos/${idProjeto}`, "PATCH", {
        nome: valor("campoNomeProjeto"),
        descricao: valor("campoDescricaoProjeto"),
        status: pegar("campoStatusProjeto").value,
        genero: valor("campoGeneroProjeto"),
        engine: valor("campoEngineProjeto"),
        tipoParceria: pegar("campoParceriaProjeto").value,
        duracaoEstimada: valor("campoDuracaoProjeto"),
    });

    if (!resposta) return;

    avisarSucesso("Projeto atualizado.");
    pegar("blocoEdicaoProjeto").classList.add("escondido");
    carregarProjeto();
};


carregarProjeto();
