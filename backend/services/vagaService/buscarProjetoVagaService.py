import models.vagaProjeto as v
import models.projetos as p


class BuscarProjetoVagaService:
    def execute(self, id):
        vaga = v.buscarPorId(id)

        if vaga is None:
            return {"erro": "Vaga não encontrada"}, 404

        return p.to_dict(v.getProjeto(vaga)), 200
