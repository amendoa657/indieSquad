from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO
from repositories.projetoRepository import ProjetoRepository


class RemoverProjetoService:
    def execute(self, id):
        projeto = ProjetoRepository.buscarPorId(id)

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        if not ehDonoDoProjeto(projeto):
            return ERRO_NAO_E_DONO

        nome = projeto.nome
        ProjetoRepository.removerProjeto(projeto)

        return {"mensagem": f"Projeto {nome} removido"}, 200
