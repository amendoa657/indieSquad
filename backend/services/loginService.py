import models.usuario as u


class LoginService:
    def execute(self, dados):
        email = dados["email"]
        senha = dados["senha"]

        usuario = u.buscarPorEmail(email)

        if usuario is None or usuario.senha != senha:
            return {"erro": "Credenciais invalidas"}, 401

        token = f"usuario-{usuario.id}"

        return {"token": token}, 200
