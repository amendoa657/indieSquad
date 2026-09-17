import models.usuario as u


class BuscarUsuarioService:
    def execute(self, id):
        usuario = u.mostrarUsuario(id)

        if usuario is None:
            return {"erro": "Usuario nao encontrado"}, 404

        return u.to_dict(usuario)
