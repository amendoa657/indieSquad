import models.candidaturaUsuario as c
from middlewares.autenticacao import idUsuarioLogado


# antes essa rota devolvia TODAS as candidaturas do sistema pra qualquer um
class ListarCandidaturasService:
    def execute(self):
        candidaturas = c.listarPorUsuario(idUsuarioLogado())

        return [c.to_dict(candidatura) for candidatura in candidaturas], 200
