import models.usuario as u
from middlewares.autenticacao import usuarioLogado
from middlewares.validacao import campoFaltando
from repositories.usuarioRepository import UsuarioRepository


class AlterarSenhaService:
    def execute(self, dados):
        faltando = campoFaltando(dados, ["senhaAtual", "senhaNova"])

        if faltando:
            return {"erro": f"O campo {faltando} é obrigatório"}, 400

        usuario = usuarioLogado()

        # pedir a senha atual impede que um token roubado tome a conta
        if not u.senhaCorreta(usuario, dados["senhaAtual"]):
            return {"erro": "A senha atual está errada"}, 401

        if not u.senhaForte(dados["senhaNova"]):
            return {"erro": f"A senha precisa de pelo menos {u.TAMANHO_MINIMO_SENHA} caracteres"}, 400

        UsuarioRepository.definirSenha(usuario, dados["senhaNova"])

        return {"mensagem": "Senha alterada com sucesso"}, 200
