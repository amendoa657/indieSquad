import models.candidaturaUsuario as c
import models.projetos as p


class BuscarProjetoCandidaturaService:
    def execute(self, id):
        candidatura = c.buscarPorId(id)

        if candidatura is None:
            return {"erro": "Candidatura nao encontrada"}, 404

        return p.to_dict(candidatura.projetoVaga)
