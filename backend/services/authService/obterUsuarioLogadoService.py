import models.usuario as u
from middlewares.autenticacao import usuarioLogado


# Serve pro front descobrir quem esta logado sem precisar decifrar o token.
class ObterUsuarioLogadoService:
    def execute(self):
        usuario = usuarioLogado()

        if usuario is None:
            return {"erro": "Precisa estar logado"}, 401

        return u.to_dictCompleto(usuario), 200
