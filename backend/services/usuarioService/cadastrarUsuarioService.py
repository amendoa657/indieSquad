import models.usuario as u
from middlewares.autenticacao import gerarToken
from middlewares.validacao import campoFaltando, texto


class CadastrarUsuarioService:
    def execute(self, dados):
        faltando = campoFaltando(dados, ["nome", "handle", "email", "senha"])

        if faltando:
            return {"erro": f"O campo {faltando} e obrigatorio"}, 400

        # "nome" (nome de exibicao, vindo do front) vai pra coluna "usuario",
        # seguindo o mesmo padrao que ja existe nos dados atuais da tabela.
        nome = texto(dados["nome"], 60)
        handle = texto(dados["handle"], 30).lower()
        email = texto(dados["email"], 90).lower()
        senha = dados["senha"]
        objetivo = dados.get("objetivo", "ambos")

        if not u.handleValido(handle):
            return {"erro": "O apelido aceita so letra minuscula, numero e underline, de 3 a 30 caracteres"}, 400

        if "@" not in email or "." not in email:
            return {"erro": "E-mail invalido"}, 400

        if not u.senhaForte(senha):
            return {"erro": f"A senha precisa de pelo menos {u.TAMANHO_MINIMO_SENHA} caracteres"}, 400

        if not u.objetivoValido(objetivo):
            return {"erro": "Objetivo invalido"}, 400

        if u.buscarPorEmail(email):
            return {"erro": "E-mail ja cadastrado"}, 409

        if u.buscarPorHandle(handle):
            return {"erro": "Esse apelido ja esta em uso"}, 409

        usuario = u.registrarUsuario(handle, nome, email, senha)

        usuario.objetivo = objetivo
        u.salvar()

        return {
            "token": gerarToken(usuario),
            "usuario": u.to_dictCompleto(usuario)
        }, 201
