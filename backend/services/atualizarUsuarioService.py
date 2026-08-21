import models.usuario as u


class AtualizarUsuarioService:
    def execute(self, id, dados):
        usuario = u.buscarPorId(id)

        if usuario is None:
            return {"erro": "Usuario nao encontrado"}, 404

        if "usuario" in dados:
            usuario.usuario = dados["usuario"]

        if "email" in dados:
            usuario.email = dados["email"]

        if "senha" in dados:
            usuario.senha = dados["senha"]

        if "bio" in dados:
            usuario.bio = dados["bio"]

        if "fotoDePerfil" in dados:
            usuario.fotoDePerfil = dados["fotoDePerfil"]

        u.salvar()

        return "Usuario alterado com sucesso", 200
