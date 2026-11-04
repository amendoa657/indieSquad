import models.avaliacao as a
import models.projetos as p
import models.usuario as u
from middlewares.autenticacao import idUsuarioLogado
from repositories.avaliacaoRepository import AvaliacaoRepository
from repositories.projetoRepository import ProjetoRepository
from services.avaliacaoService.reputacaoService import ReputacaoService


# monta a tela de avaliacao do ponto de vista de quem esta logado
class ListarAvaliacoesProjetoService:
    def execute(self, idProjeto):
        projeto = ProjetoRepository.buscarPorId(idProjeto)

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        idLogado = idUsuarioLogado()

        if not p.ehDaEquipe(projeto, idLogado):
            return {"erro": "Você não participou desse projeto"}, 403

        # a equipe inteira: o criador mais os membros
        equipe = [projeto.criador] + [membro.usuario for membro in projeto.membros]

        colegas = []
        for pessoa in equipe:
            if pessoa.id == idLogado:
                continue

            minha = AvaliacaoRepository.buscarDoAvaliador(idLogado, pessoa.id, projeto.id)
            dela = AvaliacaoRepository.buscarDoAvaliador(pessoa.id, idLogado, projeto.id)

            # eu so leio a avaliacao que recebi quando ela estiver liberada
            recebida = None
            if dela and ReputacaoService.liberada(dela):
                recebida = a.to_dict(dela)

            colegas.append({
                "usuario": u.to_dict(pessoa),
                "jaAvaliei": minha is not None,
                "minhaAvaliacao": a.to_dict(minha) if minha else None,
                "recebida": recebida,
                "esperandoResposta": minha is not None and recebida is None
            })

        return {
            "projeto": {
                "id": projeto.id,
                "nome": projeto.nome,
                "status": projeto.status,
                "dataConclusao": projeto.dataConclusao
            },
            "podeAvaliar": projeto.status == "concluido",
            "prazoLiberacaoDias": a.PRAZO_LIBERACAO_DIAS,
            "colegas": colegas
        }, 200
