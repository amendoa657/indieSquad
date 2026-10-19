import models.usuario as u
import models.avaliacao as a
from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE


class ObterDashboardService:
    def execute(self, idUsuario):
        usuario = u.buscarPorId(idUsuario)

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        if not ehOProprio(idUsuario):
            return ERRO_NAO_E_VOCE

        projetosCriados = usuario.projetosCriados
        projetosAtivos = [projeto for projeto in projetosCriados if projeto.status == "ativo"]
        concluidos = [projeto for projeto in projetosCriados if projeto.status == "concluido"]

        totalProjetos = len(projetosCriados)
        taxaConclusao = round((len(concluidos) / totalProjetos) * 100) if totalProjetos > 0 else 0

        candidaturasPendentes = len([c for c in usuario.candidaturas if c.status == "pendente"])

        # candidaturas esperando resposta DELE, nos projetos que ele criou
        aguardandoResposta = 0
        for projeto in projetosCriados:
            for vaga in projeto.vagas:
                aguardandoResposta += len([c for c in vaga.candidaturasUsuarios if c.status == "pendente"])

        listaProjetos = []
        for projeto in projetosAtivos:
            totalVagas = len(projeto.vagas)
            vagasPreenchidas = len([vaga for vaga in projeto.vagas if vaga.status != "aberta"])
            progresso = round((vagasPreenchidas / totalVagas) * 100) if totalVagas > 0 else 0

            marcos = projeto.marcos
            marcosConcluidos = len([marco for marco in marcos if marco.concluido])

            listaProjetos.append({
                "id": projeto.id,
                "nome": projeto.nome,
                "status": projeto.status,
                "genero": projeto.genero,
                "engine": projeto.engine,
                "membros": len(projeto.membros),
                "vagasAbertas": len([vaga for vaga in projeto.vagas if vaga.status == "aberta"]),
                "candidaturasPendentes": len([
                    c for vaga in projeto.vagas for c in vaga.candidaturasUsuarios if c.status == "pendente"
                ]),
                "progresso": progresso,
                "totalMarcos": len(marcos),
                "marcosConcluidos": marcosConcluidos
            })

        # os projetos que a pessoa participa mas nao criou
        colaboracoes = []
        for participacao in usuario.participacoes:
            projeto = participacao.projeto

            colaboracoes.append({
                "id": projeto.id,
                "nome": projeto.nome,
                "status": projeto.status,
                "cargo": participacao.cargo or "Membro",
                "criador": projeto.criador.usuario
            })

        return {
            "id": usuario.id,
            "handle": usuario.handle,
            "nome": usuario.usuario,
            "objetivo": usuario.objetivo,
            "projetosAtivos": len(projetosAtivos),
            "colaboracoes": len(usuario.participacoes),
            "taxaConclusao": taxaConclusao,
            "totalProjetos": totalProjetos,
            "candidaturasPendentes": candidaturasPendentes,
            "aguardandoResposta": aguardandoResposta,
            "reputacao": a.reputacao(usuario.id),
            "projetos": listaProjetos,
            "participacoes": colaboracoes
        }, 200
