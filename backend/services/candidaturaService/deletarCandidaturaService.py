from middlewares.autenticacao import idUsuarioLogado
from repositories.candidaturaRepository import CandidaturaRepository


class DeletarCandidaturaService:
    def execute(self, id):
        candidatura = CandidaturaRepository.buscarPorId(id)

        if candidatura is None:
            return {"erro": "Candidatura não encontrada"}, 404

        if candidatura.usuario_id != idUsuarioLogado():
            return {"erro": "Essa candidatura não é sua"}, 403

        if candidatura.status == "aceita":
            return {"erro": "Essa candidatura foi aceita, fale com o dono do projeto"}, 409

        CandidaturaRepository.removerCandidatura(candidatura)

        return {"mensagem": "Candidatura cancelada com sucesso"}, 200
