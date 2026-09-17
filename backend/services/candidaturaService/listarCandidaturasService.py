import models.candidaturaUsuario as c


class ListarCandidaturasService:
    def execute(self):
        return [c.to_dict(candidatura) for candidatura in c.mostrarCandidaturas()]
