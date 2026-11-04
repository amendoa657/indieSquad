import models.vagaProjeto as v
from repositories.vagaProjetoRepository import VagaProjetoRepository


class ListarVagasService:
    def execute(self):
        return [v.to_dict(vaga) for vaga in VagaProjetoRepository.mostrarVagaProjetos()], 200
