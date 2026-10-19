import models.usuario as u
from middlewares.autenticacao import ehOProprio


class BuscarUsuarioService:
    def execute(self, id):
        usuario = u.mostrarUsuario(id)

        if usuario is None:
            return {"erro": "Usuario nao encontrado"}, 404

        # O e-mail so sai quando a pessoa pede os proprios dados.
        if ehOProprio(id):
            return u.to_dictCompleto(usuario), 200

        return u.to_dict(usuario), 200
