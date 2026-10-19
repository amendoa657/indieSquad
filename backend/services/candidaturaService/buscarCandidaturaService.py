import models.candidaturaUsuario as c
from middlewares.autenticacao import idUsuarioLogado


class BuscarCandidaturaService:
    def execute(self, id):
        candidatura = c.buscarPorId(id)

        if candidatura is None:
            return {"erro": "Candidatura não encontrada"}, 404

        idLogado = idUsuarioLogado()
        projeto = c.getProjeto(candidatura)

        # candidatura e assunto de duas pessoas: quem se candidatou e quem recebeu
        if candidatura.usuario_id != idLogado and projeto.criador_id != idLogado:
            return {"erro": "Essa candidatura não é sua"}, 403

        return c.to_dict(candidatura), 200
