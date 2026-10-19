import models.usuario as u
import models.linkUsuario as l


class ListarLinksUsuarioService:
    def execute(self, id):
        usuario = u.buscarPorId(id)

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        return [l.to_dict(link) for link in u.getLinksUsuario(usuario)], 200
