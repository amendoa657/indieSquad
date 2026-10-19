import models.candidaturaUsuario as c
from middlewares.autenticacao import idUsuarioLogado


class DeletarCandidaturaService:
    def execute(self, id):
        candidatura = c.buscarPorId(id)

        if candidatura is None:
            return {"erro": "Candidatura não encontrada"}, 404

        if candidatura.usuario_id != idUsuarioLogado():
            return {"erro": "Essa candidatura não é sua"}, 403

        if candidatura.status == "aceita":
            return {"erro": "Essa candidatura foi aceita, fale com o dono do projeto"}, 409

        c.removerCandidatura(candidatura)

        return {"mensagem": "Candidatura cancelada com sucesso"}, 200
