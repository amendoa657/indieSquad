import models.usuario as u


class DeletarUsuarioService:
    def execute(self, id):
        usuario = u.buscarPorId(id)

        if usuario is None:
            return {"erro": "Usuario nao encontrado"}, 404

        u.deletarUsuario(usuario)

        return "Usuario deletado com sucesso", 200
