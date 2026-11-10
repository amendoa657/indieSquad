
protegerPagina();


const idProjeto = parametro("id");
let skillsDoBanco = [];


// candidatar abre o dialogo da mensagem; enviar e que manda pro servidor
function candidatar(idVaga, titulo) {
    avisar("");

    const dialogo = pegar("dialogoCandidatura");

    dialogo.dataset.vaga = idVaga;
    escrever("tituloCandidatura", `Entrar como ${escapar(titulo || "membro")}`);
    pegar("mensagemCandidatura").value = "";
    dialogo.showModal();
}

async function enviarCandidatura() {
    const resposta = await pedir("/candidaturas", "POST", {
        idVagaProjeto: Number(pegar("dialogoCandidatura").dataset.vaga),
        mensagem: pegar("mensagemCandidatura").value.trim(),
    });

    if (!resposta) return;

    avisarSucesso("Candidatura enviada! Acompanhe em 'Candidaturas'.");
    carregarProjeto();
}

pegar("formCandidatura").onsubmit = function (evento) {
    // o form e method="dialog": o navegador fecha o dialogo sozinho
    if (evento.submitter && evento.submitter.value === "enviar") {
        enviarCandidatura();
    }
};


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
        <div class="cartaoTopo">
            ${sprite(pessoa, 36)}
            <div class="cartaoTitulo">
                <h3>${escapar(pessoa.usuario)}</h3>
                <span>@${escapar(pessoa.handle || "")}</span>
            </div>
        </div>
    `;

    // ja recebi a avaliacao dela: as duas enviaram, entao as duas aparecem
    if (colega.recebida) {
        const recebida = colega.recebida;

        return `
            <article class="cartao cartaoAvaliacao">
                ${cabecalho}
                <div class="notaRecebida">
                    <is-numero class="notaAvaliacao">${numero(recebida.nota, 0)}</is-numero>
                    <div class="notasDetalhe">
                        <span>Comunicação <is-medidor valor="${recebida.notaComunicacao}" max="5" segmentos="5"></is-medidor></span>
                        <span>Prazo <is-medidor valor="${recebida.notaPrazo}" max="5" segmentos="5"></is-medidor></span>
                        <span>Qualidade <is-medidor valor="${recebida.notaQualidade}" max="5" segmentos="5"></is-medidor></span>
                    </div>
                </div>
                ${recebida.comentario ? `<p class="citacao">“${escapar(recebida.comentario)}”</p>` : ""}
            </article>
        `;
    }

    // eu ja avaliei, mas a outra pessoa ainda nao
    if (colega.esperandoResposta) {
        return `
            <article class="cartao cartaoAvaliacao">
                ${cabecalho}
                <p class="avisoEspera">
                    <mo-simbolo nome="relogio"></mo-simbolo>
                    Você já avaliou. A sua nota e a dela só aparecem quando ${escapar(pessoa.usuario)} também avaliar.
                </p>
            </article>
        `;
    }

    return `
        <article class="cartao cartaoAvaliacao">
            ${cabecalho}
            ${campoNota("Comunicação", "comunicacao", pessoa.id)}
            ${campoNota("Cumpriu prazos", "prazo", pessoa.id)}
            ${campoNota("Qualidade da entrega", "qualidade", pessoa.id)}

            <div class="campoFormulario">
                <label for="comentario-${pessoa.id}">Comentário</label>
                <textarea id="comentario-${pessoa.id}" placeholder="O que foi bom, o que daria pra melhorar..."></textarea>
            </div>

            <button type="button" class="mo-tecla mo-tecla--destaque" onclick="avaliar(${pessoa.id})">Enviar avaliação</button>
        </article>
    `;
}


async function carregarAvaliacoes() {
    const dados = await pedir(`/projetos/${idProjeto}/avaliacoes`);
    if (!dados) return;

    pegar("blocoAvaliacoes").classList.remove("escondido");

    escrever("explicacaoDuploCego",
        `A sua avaliação fica escondida até a outra pessoa enviar a dela, ou até passar ${dados.prazoLiberacaoDias} dias. ` +
        `Assim ninguém avalia já sabendo que nota vai receber de volta.`);

    const colegas = await Promise.all(dados.colegas.map(async (colega) => ({ ...colega, usuario: await comFuncoes(colega.usuario) })));

    listar("listaAvaliacoes", colegas, cardColega, "Você foi o único participante desse projeto.");
}


// match

// a cor acompanha a nota: verde combina muito, laranja combina em parte
function classeDaNota(nota) {
    if (nota >= 70) return "notaAlta";
    if (nota >= 45) return "notaMedia";
    return "notaBaixa";
}


// os sete criterios do match, na ordem em que pesam
const CRITERIOS = [
    ["funcao", "Função"],
    ["nivel", "Nível"],
    ["parceria", "Parceria"],
    ["ferramenta", "Ferramentas"],
    ["disponibilidade", "Tempo"],
    ["reputacao", "Reputação"],
    ["texto", "Descrição"],
];

function seloCompatibilidade(compatibilidade) {
    if (!compatibilidade) return "";

    const fortes = compatibilidade.fortes.map((texto) => `<li class="pontoForte">${escapar(texto)}</li>`).join("");
    const fracos = compatibilidade.fracos.map((texto) => `<li class="pontoFraco">${escapar(texto)}</li>`).join("");

    // cada criterio vira uma barra: quanto voce fez de quanto dava pra fazer
    const barras = compatibilidade.criterios
        ? CRITERIOS.map(function ([chave, nome]) {
            const feito = compatibilidade.criterios[chave] || 0;
            const peso = (compatibilidade.pesos && compatibilidade.pesos[chave]) || 0;

            // cada segmento vale 5 pontos: a barra do criterio que pesa mais e mais comprida
            return `
                <div class="criterio" title="${feito} de ${peso} pontos">
                    <span>${nome}</span>
                    <span class="trilhoCriterio"><is-medidor valor="${feito}" max="${peso || 1}" segmentos="${Math.max(1, Math.round(peso / 5))}" style="width:${(peso / 35) * 100}%"></is-medidor></span>
                    <strong>${feito}/${peso}</strong>
                </div>
            `;
        }).join("")
        : "";

    return `
        <div class="blocoCompatibilidade ${classeDaNota(compatibilidade.nota)}">
            <div class="notaMatch">
                <is-numero>${compatibilidade.nota}%</is-numero>
                <span>compatível com você</span>
            </div>
            <div class="criterios">${barras}</div>
            <ul class="listaPontos">${fortes}${fracos}</ul>
        </div>
    `;
}


async function verRecomendados(idVaga) {
    const alvo = pegar(`recomendados-${idVaga}`);
    const card = alvo.closest(".cartaoVaga");

    if (!alvo.classList.contains("escondido")) {
        alvo.classList.add("escondido");
        card.classList.remove("vagaExpandida");
        return;
    }

    alvo.classList.remove("escondido");
    card.classList.add("vagaExpandida");
    escrever(`recomendados-${idVaga}`, `<p class="procurando"><i class="mo-marca mo-marca--girando"></i>Procurando quem combina...</p>`);

    const dados = await pedir(`/vagas/${idVaga}/recomendacoes`);
    if (!dados) return;

    listar(`recomendados-${idVaga}`, dados.candidatos, function (candidato) {
        const pessoa = candidato.usuario;
        const nota = candidato.compatibilidade.nota;

        const situacao = candidato.jaEhMembro
            ? `<span class="selo selo-aceita">Já está na equipe</span>`
            : candidato.jaSeCandidatou
                ? `<span class="selo selo-pendente">Já se candidatou</span>`
                : "";

        const marcaIA = candidato.explicadoPorIA
            ? `<span class="selo selo-ia" title="Texto escrito por IA a partir dos dados do perfil">IA</span>`
            : "";

        return `
            <article class="recomendado cardClicavel mira ${classeDaNota(nota)}" onclick="irPara('perfil.html?handle=${encodeURIComponent(pessoa.handle)}')">
                <div class="cartaoTopo">
                    ${sprite(pessoa, 36)}
                    <div class="cartaoTitulo">
                        <h3>${escapar(pessoa.usuario)}</h3>
                        <span>@${escapar(pessoa.handle)}</span>
                    </div>
                    <is-numero class="notaRecomendado">${nota}%</is-numero>
                </div>
                <p class="cartaoTexto">${marcaIA} ${escapar(candidato.explicacao)}</p>
                <div class="tags">
                    ${pessoa.skills.map((skill) => tagFuncao(skill)).join("")}
                    ${situacao}
                </div>
            </article>
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

    // os membros ganham as funcoes, pra cada bonequinho sair na cor da classe
    const membros = await Promise.all(((await pedir(`/projetos/${idProjeto}/membros`)) || []).map(comFuncoes));
    const vagas = (await pedir(`/projetos/${idProjeto}/vagas`)) || [];

    pegar("avatarProjeto").setAttribute("nome", projeto.nome);
    pegar("bannerProjeto").dataset.tom = tomDoNome(projeto.nome);
    escrever("nomeProjeto", escapar(projeto.nome));
    escrever("statusProjeto", escapar(rotulo(projeto.status)));
    pegar("statusProjeto").className = `seloStatus selo-${projeto.status}`;
    escrever("criadorProjeto", escapar(projeto.criador.usuario));
    pegar("spriteCriador").setAttribute("semente", projeto.criador.handle);
    comFuncoes(projeto.criador).then(function (criador) {
        const principal = funcaoPrincipal(criador);
        if (principal) pegar("spriteCriador").className = classe(principal.categoria);
    });
    pegar("linkCriador").href = `perfil.html?handle=${encodeURIComponent(projeto.criador.handle)}`;
    escrever("descricaoProjeto", escapar(projeto.descricao) || "Sem descrição.");
    document.title = `${projeto.nome} · IndieSquad`;

    const abertas = vagas.filter((vaga) => vaga.status === "aberta");

    escrever("totalMembros", membros.length);
    escrever("totalVagasAbertas", abertas.length);
    escrever("totalCandidaturas", vagas.reduce((soma, vaga) => soma + (vaga.totalCandidaturas || 0), 0));
    escrever("contadorVagas", vagas.length);

    // as vagas so dizem o nome da funcao: o catalogo diz a classe de cada uma
    const skills = await catalogo();
    const categoriaDe = (nome) => (skills.find((skill) => skill.nome === nome) || {}).categoria;

    // ficha tecnica: campos que o formulario ja pedia e eram descartados
    if (pegar("fichaProjeto")) {
        const ficha = [
            ["Gênero", projeto.genero],
            ["Engine", projeto.engine],
            ["Parceria", TIPOS_PARCERIA[projeto.tipoParceria] || projeto.tipoParceria],
            ["Duração", projeto.duracaoEstimada],
            ["Criado em", dataBonita(projeto.dataCriacao)],
        ].filter((item) => item[1]);

        listar("fichaProjeto", ficha, function (item) {
            return `<div class="itemFicha"><span>${escapar(item[0])}</span><strong>${escapar(item[1])}</strong></div>`;
        }, "Sem ficha técnica.");
    }

    if (pegar("marcosProjeto")) {
        const marcos = projeto.marcos || [];
        const concluidos = marcos.filter((marco) => marco.concluido).length;

        // o primeiro marco nao concluido e a fase em que a equipe esta agora
        const atual = marcos.findIndex((marco) => !marco.concluido);

        escrever("contadorMarcos", `${concluidos}/${marcos.length}`);

        listar("marcosProjeto", marcos, function (marco, indice) {
            const estado = marco.concluido ? "marcoConcluido" : indice === atual ? "marcoAtual" : "";

            // o dono marca e desmarca o marco clicando na casa dele
            const casa = projeto.ehCriador
                ? `<button type="button" class="casaMarco" onclick="alternarMarco(${marco.id}, ${marco.concluido})" title="${marco.concluido ? "Desmarcar" : "Marcar como concluído"}">${marco.concluido ? icone("confere", 14) : ""}</button>`
                : `<span class="casaMarco">${marco.concluido ? icone("confere", 14) : ""}</span>`;

            const apagar = projeto.ehCriador
                ? `<button type="button" class="apagarMarco" onclick="apagarMarco(${marco.id})" aria-label="Apagar marco">×</button>`
                : "";

            return `
                <div class="itemMarco ${estado}">
                    <span class="faseMarco">fase ${indice + 1}</span>
                    ${casa}
                    <span class="tituloMarco">${escapar(marco.titulo)}</span>
                    ${apagar}
                </div>
            `;
        }, "Nenhum marco definido ainda.");
    }

    // a equipe como uma party: quem ja entrou e um espaco vazio por vaga aberta
    escrever("contadorEquipe", `${membros.length}/${membros.length + abertas.length}`);

    const ocupados = membros.map(function (membro) {
        const ehCriadorDoProjeto = membro.id === projeto.criador.id;

        const acoes = projeto.ehCriador && !ehCriadorDoProjeto
            ? `<button type="button" class="tirarMembro" onclick="event.stopPropagation(); tirarMembro(${membro.id}, '${escapar(membro.usuario).replace(/'/g, "")}')" aria-label="Tirar da equipe">×</button>`
            : "";

        return `
            <div class="slot slotOcupado cardClicavel mira" onclick="irPara('perfil.html?handle=${encodeURIComponent(membro.handle)}')">
                ${ehCriadorDoProjeto ? `<mo-simbolo class="coroaSlot" nome="coroa" rotulo="Criador"></mo-simbolo>` : ""}
                ${sprite(membro, 54)}
                <strong>${escapar(membro.usuario.split(" ")[0])}</strong>
                <span>${escapar(membro.cargo)}</span>
                ${acoes}
            </div>
        `;
    });

    const livres = abertas.map(function (vaga) {
        const categoria = categoriaDe(vaga.skillNome);

        return `
            <a class="slot slotLivre ${classe(categoria)}" href="#vaga-${vaga.id}">
                <span class="slotVazio"><mo-simbolo nome="${simboloDaClasse(categoria)}"></mo-simbolo></span>
                <strong>${escapar(vaga.skillNome)}</strong>
                <span>vaga aberta</span>
            </a>
        `;
    });

    escrever("listaMembros", [...ocupados, ...livres].join("") || `<p class="mensagemVazia">Ninguém na equipe ainda.</p>`);

    listar("listaVagas", vagas, function (vaga) {
        const categoria = categoriaDe(vaga.skillNome);
        const nivel = vaga.nivelMinimo ? `<span class="tag">${escapar(NIVEIS[vaga.nivelMinimo])} ou mais <is-nivel valor="${vaga.nivelMinimo}"></is-nivel></span>` : `<span class="tag">Qualquer nível</span>`;

        // o servidor ja diz se eu me candidatei nessa vaga
        let acao = "";

        if (vaga.minhaCandidatura) {
            acao = `<span class="statusCandidatura ${corDoStatus(vaga.minhaCandidatura.status)}">Candidatura ${escapar(rotulo(vaga.minhaCandidatura.status))}</span>`;
        } else if (vaga.status === "aberta" && !projeto.ehCriador) {
            acao = `<button type="button" class="mo-tecla mo-tecla--destaque" onclick="candidatar(${vaga.id}, '${escapar(vaga.titulo).replace(/'/g, "")}')">Candidatar-se</button>`;
        }

        const recomendar = projeto.ehCriador
            ? `<button type="button" class="mo-tecla mo-tecla--p" onclick="verRecomendados(${vaga.id})"><mo-simbolo nome="busca"></mo-simbolo> Quem combina</button>`
            : "";

        const acoesDono = projeto.ehCriador
            ? `<div class="acoesItem">
                   ${recomendar}
                   ${vaga.status === "aberta"
                       ? `<button type="button" class="mo-tecla mo-tecla--p" onclick="fecharVaga(${vaga.id})">Fechar</button>`
                       : `<button type="button" class="mo-tecla mo-tecla--p" onclick="reabrirVaga(${vaga.id})">Reabrir</button>`}
                   <button type="button" class="mo-tecla mo-tecla--p mo-tecla--sutil mo-tecla--perigo" onclick="apagarVaga(${vaga.id})">Apagar</button>
               </div>`
            : "";

        return `
            <article class="cartao cartaoVaga ${classe(categoria)}" id="vaga-${vaga.id}">
                <div class="cartaoTopo">
                    <span class="iconeClasse"><mo-simbolo nome="${simboloDaClasse(categoria)}"></mo-simbolo></span>
                    <div class="cartaoTitulo">
                        <h3>${escapar(vaga.titulo)}</h3>
                        <span>${escapar(categoria || "Função")} · ${plural(vaga.totalCandidaturas || 0, "candidatura", "candidaturas")}</span>
                    </div>
                    ${selo(vaga.status)}
                </div>
                ${vaga.descricao ? `<p class="cartaoTexto">${escapar(vaga.descricao)}</p>` : ""}
                <div class="tags">${nivel}</div>
                ${seloCompatibilidade(vaga.compatibilidade)}
                ${acao || acoesDono ? `<div class="rodapeVaga">${acao}${acoesDono}</div>` : ""}
                <div class="listaRecomendados escondido" id="recomendados-${vaga.id}"></div>
            </article>
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
            ? `<span><mo-simbolo nome="estrela"></mo-simbolo>${numero(pessoa.reputacao.media)} · ${plural(pessoa.reputacao.total, "avaliação", "avaliações")}</span>`
            : `<span><mo-simbolo nome="estrela"></mo-simbolo>sem avaliação ainda</span>`;

        // pendente mostra os botoes; ja respondida mostra so o resultado
        const acoes = candidatura.status === "pendente"
            ? `<button type="button" class="mo-tecla mo-tecla--destaque" onclick="responder(${candidatura.id}, 'aceita')"><mo-simbolo nome="check"></mo-simbolo> Aceitar na equipe</button>
               <button type="button" class="mo-tecla mo-tecla--sutil" onclick="responder(${candidatura.id}, 'recusada')">Recusar</button>`
            : `<span class="statusCandidatura ${corDoStatus(candidatura.status)}">${escapar(rotulo(candidatura.status))}</span>`;

        const mensagem = candidatura.mensagem
            ? `<p class="citacao">“${escapar(candidatura.mensagem)}”</p>`
            : "";

        return `
            <article class="cartao cartaoCandidato ${classe((funcaoPrincipal(pessoa) || {}).categoria)}">
                <div class="cartaoTopo">
                    ${sprite(pessoa, 45)}
                    <div class="cartaoTitulo">
                        <h3><a href="perfil.html?handle=${encodeURIComponent(pessoa.handle)}">${escapar(pessoa.usuario)}</a></h3>
                        <span>quer ser <strong>${escapar(candidatura.vaga.titulo)}</strong></span>
                    </div>
                </div>
                <div class="statusPessoa">${nota}</div>
                <div class="tags">
                    ${pessoa.skills.map((skill) => tagFuncao(skill)).join("")}
                </div>
                ${mensagem}
                <div class="rodapeVaga">${acoes}</div>
            </article>
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
