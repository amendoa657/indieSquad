import models.projetos as p
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO


# concluir encerra as vagas abertas e libera a avaliacao entre a equipe
class ConcluirProjetoService:
    def execute(self, id):
        projeto = p.buscarPorId(id)

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        if not ehDonoDoProjeto(projeto):
            return ERRO_NAO_E_DONO

        if projeto.status == "concluido":
            return {"erro": "Esse projeto já foi concluído"}, 409

        p.concluirProjeto(projeto)

        return p.to_dict(projeto), 200
