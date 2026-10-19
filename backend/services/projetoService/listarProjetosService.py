import models.projetos as p


class ListarProjetosService:
    def execute(self):
        return [p.to_dict(projeto) for projeto in p.mostrarProjetos()], 200
