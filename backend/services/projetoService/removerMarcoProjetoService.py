import models.marcoProjeto as m
import models.projetos as p
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO


class RemoverMarcoProjetoService:
    def execute(self, idMarco):
        marco = m.buscarPorId(idMarco)

        if marco is None:
            return {"erro": "Marco não encontrado"}, 404

        if not ehDonoDoProjeto(p.buscarPorId(marco.projeto_id)):
            return ERRO_NAO_E_DONO

        m.removerMarco(marco)

        return {"mensagem": "Marco removido"}, 200
