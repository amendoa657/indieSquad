import models.candidaturaUsuario as c


class DeletarCandidaturaService:
    def execute(self, id):
        candidatura = c.buscarPorId(id)

        if candidatura is None:
            return {"erro": "Candidatura nao encontrada"}, 404

        c.removerCandidatura(candidatura)

        return "Candidatura deletada com sucesso", 200
