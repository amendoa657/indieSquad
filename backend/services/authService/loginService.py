import models.usuario as u
from middlewares.autenticacao import gerarToken
from middlewares.validacao import campoFaltando, texto


class LoginService:
    def execute(self, dados):
        faltando = campoFaltando(dados, ["email", "senha"])

        if faltando:
            return {"erro": f"O campo {faltando} e obrigatorio"}, 400

        email = texto(dados["email"], 90).lower()
        senha = dados["senha"]

        usuario = u.buscarPorEmail(email)

        # A mensagem e a mesma pro e-mail que nao existe e pra senha errada.
        # Se fosse diferente, daria pra descobrir quais e-mails tem conta aqui.
        if usuario is None or not u.senhaCorreta(usuario, senha):
            return {"erro": "Credenciais invalidas"}, 401

        return {
            "token": gerarToken(usuario),
            "usuario": u.to_dictCompleto(usuario)
        }, 200
