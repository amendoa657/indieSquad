import models.vagaProjeto as v
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO


class DeletarVagaService:
    def execute(self, id):
        vaga = v.buscarPorId(id)

        if vaga is None:
            return {"erro": "Vaga nao encontrada"}, 404

        if not ehDonoDoProjeto(v.getProjeto(vaga)):
            return ERRO_NAO_E_DONO

        titulo = vaga.titulo
        v.removerVagaProjeto(vaga)

        return {"mensagem": f"Vaga {titulo} removida com sucesso!"}, 200
