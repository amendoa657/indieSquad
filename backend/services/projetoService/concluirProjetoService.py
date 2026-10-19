import models.projetos as p
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO


# Concluir e o que fecha o ciclo do projeto: as vagas abertas sao encerradas e
# a equipe passa a poder se avaliar.
class ConcluirProjetoService:
    def execute(self, id):
        projeto = p.buscarPorId(id)

        if projeto is None:
            return {"erro": "Projeto nao encontrado"}, 404

        if not ehDonoDoProjeto(projeto):
            return ERRO_NAO_E_DONO

        if projeto.status == "concluido":
            return {"erro": "Esse projeto ja foi concluido"}, 409

        p.concluirProjeto(projeto)

        return p.to_dict(projeto), 200
