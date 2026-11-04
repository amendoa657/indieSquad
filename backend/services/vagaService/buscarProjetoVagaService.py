import models.vagaProjeto as v
import models.projetos as p
from repositories.vagaProjetoRepository import VagaProjetoRepository


class BuscarProjetoVagaService:
    def execute(self, id):
        vaga = VagaProjetoRepository.buscarPorId(id)

        if vaga is None:
            return {"erro": "Vaga não encontrada"}, 404

        return p.to_dict(v.getProjeto(vaga)), 200
