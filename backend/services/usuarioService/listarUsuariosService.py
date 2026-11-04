import models.usuario as u
from repositories.usuarioRepository import UsuarioRepository


class ListarUsuariosService:
    def execute(self):
        usuarios = UsuarioRepository.mostrarUsuarios()

        return [u.to_dict(usuario) for usuario in usuarios], 200
