import models.vagaProjeto as v


class DeletarVagaService:
    def execute(self, id):
        vaga = v.buscarPorId(id)

        if vaga is None:
            return {"erro": "Vaga nao encontrada"}, 404

        v.removerVagaProjeto(vaga)

        return "Vaga deletada com sucesso", 200
