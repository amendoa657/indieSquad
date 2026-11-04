import models.skills as s
from repositories.vagaProjetoRepository import VagaProjetoRepository


class BuscarSkillVagaService:
    def execute(self, id):
        vaga = VagaProjetoRepository.buscarPorId(id)

        if vaga is None:
            return {"erro": "Vaga não encontrada"}, 404

        return s.to_dict(vaga.skill), 200
