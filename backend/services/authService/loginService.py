import models.usuario as u
from middlewares.autenticacao import gerarToken
from middlewares.validacao import campoFaltando, texto
from repositories.usuarioRepository import UsuarioRepository


class LoginService:
    def execute(self, dados):
        faltando = campoFaltando(dados, ["email", "senha"])

        if faltando:
            return {"erro": f"O campo {faltando} é obrigatório"}, 400

        email = texto(dados["email"], 90).lower()
        senha = dados["senha"]

        usuario = UsuarioRepository.buscarPorEmail(email)

        # a mensagem e a mesma pro e-mail que nao existe e pra senha errada
        if usuario is None or not u.senhaCorreta(usuario, senha):
            return {"erro": "Credenciais inválidas"}, 401

        return {
            "token": gerarToken(usuario),
            "usuario": u.to_dictCompleto(usuario)
        }, 200
