import models.candidaturaUsuario as c
import models.usuario as u


class BuscarUsuarioCandidaturaService:
    def execute(self, id):
        candidatura = c.buscarPorId(id)

        if candidatura is None:
            return {"erro": "Candidatura nao encontrada"}, 404

        return u.to_dict(candidatura.candidato)
