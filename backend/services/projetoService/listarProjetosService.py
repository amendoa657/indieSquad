import models.projetos as p
from repositories.projetoRepository import ProjetoRepository


class ListarProjetosService:
    def execute(self):
        return [p.to_dict(projeto) for projeto in ProjetoRepository.mostrarProjetos()], 200
