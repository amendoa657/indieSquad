import models.projetos as p


class RemoverProjetoService:
    def execute(self, id):
        projeto = p.buscarPorId(id)

        if projeto is None:
            return {"erro": "Projeto nao encontrado"}, 404

        return p.removerProjeto(projeto)
