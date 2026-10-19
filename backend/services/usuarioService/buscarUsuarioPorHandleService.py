import models.usuario as u


# E o que faz a URL de perfil publico funcionar (perfil.html?handle=thales).
class BuscarUsuarioPorHandleService:
    def execute(self, handle):
        usuario = u.buscarPorHandle((handle or "").lower())

        if usuario is None:
            return {"erro": "Usuario nao encontrado"}, 404

        return u.to_dict(usuario), 200
