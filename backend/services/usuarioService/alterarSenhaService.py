import models.usuario as u
from middlewares.autenticacao import usuarioLogado
from middlewares.validacao import campoFaltando


class AlterarSenhaService:
    def execute(self, dados):
        faltando = campoFaltando(dados, ["senhaAtual", "senhaNova"])

        if faltando:
            return {"erro": f"O campo {faltando} e obrigatorio"}, 400

        usuario = usuarioLogado()

        # Pedir a senha atual impede que um token roubado troque a senha e
        # tome a conta de vez.
        if not u.senhaCorreta(usuario, dados["senhaAtual"]):
            return {"erro": "A senha atual esta errada"}, 401

        if not u.senhaForte(dados["senhaNova"]):
            return {"erro": f"A senha precisa de pelo menos {u.TAMANHO_MINIMO_SENHA} caracteres"}, 400

        u.definirSenha(usuario, dados["senhaNova"])

        return {"mensagem": "Senha alterada com sucesso"}, 200
