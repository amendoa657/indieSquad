import models.vagaProjeto as v
import models.skills as s


class BuscarSkillVagaService:
    def execute(self, id):
        vaga = v.buscarPorId(id)

        if vaga is None:
            return {"erro": "Vaga nao encontrada"}, 404

        return s.to_dict(vaga.skill), 200
