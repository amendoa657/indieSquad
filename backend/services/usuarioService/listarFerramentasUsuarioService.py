import models.usuario as u
import models.ferramentaUsuario as fu
from repositories.usuarioRepository import UsuarioRepository


class ListarFerramentasUsuarioService:
    def execute(self, id):
        usuario = UsuarioRepository.buscarPorId(id)

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        return [fu.to_dict(vinculo) for vinculo in u.getFerramentasUsuario(usuario)], 200
