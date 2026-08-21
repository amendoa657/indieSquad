import models.candidaturaUsuario as c


class BuscarCandidaturaService:
    def execute(self, id):
        candidatura = c.buscarPorId(id)

        if candidatura is None:
            return {"erro": "Candidatura nao encontrada"}, 404

        return c.to_dict(candidatura)
