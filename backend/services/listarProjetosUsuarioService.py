import models.usuario as u
import models.projetos as p


class ListarProjetosUsuarioService:
    def execute(self, id):
        usuario = u.buscarPorId(id)

        if usuario is None:
            return {"erro": "Usuario nao encontrado"}, 404

        return [p.to_dict(projeto) for projeto in usuario.projetosCriados]
