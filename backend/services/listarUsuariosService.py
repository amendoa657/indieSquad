import models.usuario as u


class ListarUsuariosService:
    def execute(self):
        usuarios = u.mostrarUsuarios()
        return [u.to_dict(usuario) for usuario in usuarios]
