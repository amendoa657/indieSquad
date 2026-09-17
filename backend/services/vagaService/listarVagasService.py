import models.vagaProjeto as v


class ListarVagasService:
    def execute(self):
        return [v.to_dict(vaga) for vaga in v.mostrarVagaProjetos()]
