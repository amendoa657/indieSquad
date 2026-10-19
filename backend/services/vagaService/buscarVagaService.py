import models.vagaProjeto as v


class BuscarVagaService:
    def execute(self, id):
        vaga = v.buscarPorId(id)

        if vaga is None:
            return {"erro": "Vaga nao encontrada"}, 404

        return v.to_dict(vaga), 200
