import models.vagaProjeto as v


class BuscarVagaService:
    def execute(self, id):
        vaga = v.buscarPorId(id)

        if vaga is None:
            return {"erro": "Vaga não encontrada"}, 404

        return v.to_dict(vaga), 200
