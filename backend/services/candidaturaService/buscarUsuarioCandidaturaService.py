import models.candidaturaUsuario as c
import models.usuario as u
from middlewares.autenticacao import idUsuarioLogado


class BuscarUsuarioCandidaturaService:
    def execute(self, id):
        candidatura = c.buscarPorId(id)

        if candidatura is None:
            return {"erro": "Candidatura não encontrada"}, 404

        projeto = c.getProjeto(candidatura)
        idLogado = idUsuarioLogado()

        if candidatura.usuario_id != idLogado and projeto.criador_id != idLogado:
            return {"erro": "Essa candidatura não é sua"}, 403

        return u.to_dict(candidatura.candidato), 200
