import models.vagaProjeto as v
from repositories.vagaProjetoRepository import VagaProjetoRepository


class BuscarVagaService:
    def execute(self, id):
        vaga = VagaProjetoRepository.buscarPorId(id)

        if vaga is None:
            return {"erro": "Vaga não encontrada"}, 404

        return v.to_dict(vaga), 200
