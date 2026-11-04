import models.usuario as u
from repositories.usuarioRepository import UsuarioRepository


# e o que faz a URL de perfil publico funcionar
class BuscarUsuarioPorHandleService:
    def execute(self, handle):
        usuario = UsuarioRepository.buscarPorHandle((handle or "").lower())

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        return u.to_dict(usuario), 200
