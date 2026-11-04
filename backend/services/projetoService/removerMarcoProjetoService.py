from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO
from repositories.marcoProjetoRepository import MarcoProjetoRepository
from repositories.projetoRepository import ProjetoRepository


class RemoverMarcoProjetoService:
    def execute(self, idMarco):
        marco = MarcoProjetoRepository.buscarPorId(idMarco)

        if marco is None:
            return {"erro": "Marco não encontrado"}, 404

        if not ehDonoDoProjeto(ProjetoRepository.buscarPorId(marco.projeto_id)):
            return ERRO_NAO_E_DONO

        MarcoProjetoRepository.removerMarco(marco)

        return {"mensagem": "Marco removido"}, 200
