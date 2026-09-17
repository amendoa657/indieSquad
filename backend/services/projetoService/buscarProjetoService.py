import models.projetos as p


class BuscarProjetoService:
    def execute(self, id):
        projeto = p.buscarPorId(id)

        if projeto is None:
            return {"erro": "Projeto nao encontrado"}, 404

        return p.to_dict(projeto)
