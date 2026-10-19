import models.candidaturaUsuario as c
from middlewares.autenticacao import idUsuarioLogado


# Antes essa rota devolvia TODAS as candidaturas do sistema pra qualquer um.
# Agora ela devolve so as candidaturas de quem esta logado.
class ListarCandidaturasService:
    def execute(self):
        candidaturas = c.listarPorUsuario(idUsuarioLogado())

        return [c.to_dict(candidatura) for candidatura in candidaturas], 200
