import models.projetos as p
import models.usuario as u


class BuscarCriadorProjetoService:
    def execute(self, id):
        projeto = p.buscarPorId(id)

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        return u.to_dict(projeto.criador), 200
